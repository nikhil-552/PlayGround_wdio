import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

export default class JSONToExcelConverter {
	constructor(outputFilePath, bindScreenshots = 'No') {
		this.outputFilePath = outputFilePath;
		// Convert the parameter to a boolean (true if "Yes")
		this.bindScreenshots = bindScreenshots.toUpperCase() === 'YES';
		this.testResults = [];
		this.workbook = new ExcelJS.Workbook();
		this.initializeStyles();
	}

	async convertJSONFolderToExcel(folderPath) {
		try {
			const files = fs.readdirSync(folderPath);
			for (const file of files) {
				if (file.endsWith('.json')) {
					const filePath = path.join(folderPath, file);
					const jsonContent = await fs.promises.readFile(filePath, 'utf8');
					const jsonData = JSON.parse(jsonContent);
					// Handle both array of tests or an object with testResults property
					if (Array.isArray(jsonData)) {
						for (const test of jsonData) {
							this.addTestResult(test);
						}
					} else if (jsonData.testResults && Array.isArray(jsonData.testResults)) {
						for (const test of jsonData.testResults) {
							this.addTestResult(test);
						}
					} else {
						console.warn(`Unexpected JSON structure in file: ${file}`);
					}
				}
			}
			// Always create the main "Test Results" sheet
			this.createTestResultSheet();
			// Create summary sheet with wrap text enabled.
			this.writeSummary();
			this.generateExcelReport();
		} catch (error) {
			console.error('Error converting JSON to Excel:', error);
		}
	}

	addTestResult(test) {
		const suiteName = this.removeSuiteSuffix(test.suiteName || 'Default Suite');
		const error = test.error || '';
		const status = test.status || 'UNKNOWN';
		const screenshot = test.screenshot || '';

		this.testResults.push({
			suiteName,
			testName: test.testName,
			status,
			error,
			screenshot,
		});
	}

	removeSuiteSuffix(suiteName) {
		const regex = /suite\d+$/i;
		return regex.test(suiteName) ? suiteName.replace(regex, '') : suiteName;
	}

	/**
	 * Creates the main "Test Results" sheet with columns for Suite Name, Test Name, Status, Error,
	 * and, if screenshots binding is enabled, a Screenshot column.
	 */
	createTestResultSheet() {
		const sheet = this.workbook.addWorksheet('Test Results', {
			views: [{ state: 'frozen', ySplit: 1 }],
		});

		if (this.bindScreenshots) {
			sheet.columns = [
				{ header: 'Suite Name', key: 'suiteName', width: 25 },
				{ header: 'Test Name', key: 'testName', width: 40 },
				{ header: 'Status', key: 'status', width: 10 },
				{ header: 'Error', key: 'error', width: 60 },
				{ header: 'Screenshot', key: 'screenshot', width: 40 },
			];
		} else {
			sheet.columns = [
				{ header: 'Suite Name', key: 'suiteName', width: 25 },
				{ header: 'Test Name', key: 'testName', width: 40 },
				{ header: 'Status', key: 'status', width: 10 },
				{ header: 'Error', key: 'error', width: 60 },
			];
		}

		// Style the header row
		sheet.getRow(1).eachCell(cell => {
			cell.style = this.styles.header;
		});

		let prevSuiteName = null;
		let suiteStartRow = 2; // data starts at row 2 (row 1 is header)

		this.testResults.forEach((testResult, i) => {
			const rowIndex = i + 2; // row 2 is the first data row
			const currentSuiteName = testResult.suiteName;

			// If suite changed, merge the previous suite block in the first column
			if (prevSuiteName !== null && prevSuiteName !== currentSuiteName) {
				if (suiteStartRow < rowIndex) {
					sheet.mergeCells(suiteStartRow, 1, rowIndex - 1, 1);
					sheet.getCell(suiteStartRow, 1).style = this.styles.suiteName;
				}
				suiteStartRow = rowIndex;
			}

			// Prepare row data
			const rowData = {
				suiteName: testResult.suiteName,
				testName: testResult.testName,
				status: testResult.status,
				error: testResult.error,
			};

			if (this.bindScreenshots) {
				// Remove file location text from screenshot column
				rowData.screenshot = '';
			}

			// Add row data
			const row = sheet.addRow(rowData);

			// Apply center alignment and wrap text to each cell and apply border
			row.eachCell(cell => {
				cell.border = this.styles.cellBorder;
				cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
			});

			// Color row based on status (retaining existing fill colors)
			if (testResult.status === 'FAILED') {
				row.eachCell(cell => {
					cell.fill = this.styles.failedRowFill;
				});
			} else if (testResult.status === 'PASSED') {
				row.eachCell(cell => {
					cell.fill = this.styles.passedRowFill;
				});
			}

			// If binding screenshots and a screenshot is provided, embed the image
			if (this.bindScreenshots && testResult.screenshot) {
				try {
					if (fs.existsSync(testResult.screenshot)) {
						const imageBuffer = fs.readFileSync(testResult.screenshot);
						const imageId = this.workbook.addImage({
							buffer: imageBuffer,
							extension: 'png',
						});
						// Anchor image in the "Screenshot" cell (column index 5 => 0-based index 4)
						sheet.addImage(imageId, {
							tl: { col: 4, row: row.number - 1 },
							ext: { width: 300, height: 160 },
						});
						row.height = 160;
					} else {
						console.warn(`Screenshot file not found: ${testResult.screenshot}`);
						row.height = 20;
					}
				} catch (error) {
					console.error('Error adding screenshot image to Test Results tab:', error);
					row.height = 20;
				}
			} else {
				row.height = 20;
			}

			prevSuiteName = currentSuiteName;
		});

		// Merge the last suite block (if at least one data row exists)
		if (this.testResults.length > 0) {
			const lastDataRow = this.testResults.length + 1; // last data row index
			if (suiteStartRow <= lastDataRow) {
				sheet.mergeCells(suiteStartRow, 1, lastDataRow, 1);
				sheet.getCell(suiteStartRow, 1).style = this.styles.suiteName;
			}
		}
	}

	/**
	 * Creates a "Summary" sheet that shows total, passed, and failed counts.
	 * All cells in the Summary sheet have wrap text enabled.
	 */
	writeSummary() {
		const summarySheet = this.workbook.addWorksheet('Summary');
		summarySheet.columns = [
			{ header: 'Metric', key: 'metric', width: 25 },
			{ header: 'Value', key: 'value', width: 15 },
		];

		const headerRow = summarySheet.getRow(1);
		headerRow.eachCell(cell => {
			cell.style = this.styles.summaryHeader;
		});

		const summaryStats = this.calculateSummaryStats();
		summaryStats.forEach(stat => {
			const row = summarySheet.addRow(stat);
			// Apply center alignment, wrap text and border for every cell
			row.eachCell(cell => {
				cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
				cell.style = this.styles.dataCell;
			});
		});

		summarySheet.views = [{ state: 'frozen', ySplit: 1 }];
	}

	generateExcelReport() {
		this.workbook.xlsx
			.writeFile(this.outputFilePath)
			.then(() => {
				console.log(`Excel report successfully written to ${this.outputFilePath}`);
			})
			.catch(error => {
				console.error('Error writing Excel report:', error);
			});
	}

	sanitizeErrorMessage(errorMessage) {
		if (errorMessage) {
			return errorMessage
				.replace(/[\u001b\u009b]\[\d{1,2}(;\d{1,2})?(m|K)/g, '')
				.split('\n')[0]
				.trim();
		}
		return '';
	}

	initializeStyles() {
		this.styles = {
			header: {
				font: { name: 'Calibri', bold: true, color: { argb: 'FFFFFF' } },
				alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
				fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '4F81BD' } },
				border: this.getBorderStyle('medium'),
			},
			cellBorder: this.getBorderStyle('thin'),
			passedRowFill: {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'C6EFCE' },
			},
			failedRowFill: {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'FFC7CE' },
			},
			suiteName: {
				font: { bold: true },
				alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
			},
			summaryHeader: {
				font: { name: 'Calibri', bold: true, color: { argb: 'FFFFFF' } },
				alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
				fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '002060' } },
				border: this.getBorderStyle('medium'),
			},
			dataCell: {
				font: { name: 'Calibri', bold: false },
				alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
				border: this.getBorderStyle('thin'),
			},
		};
	}

	getBorderStyle(style) {
		return {
			top: { style, color: { argb: '000000' } },
			left: { style, color: { argb: '000000' } },
			bottom: { style, color: { argb: '000000' } },
			right: { style, color: { argb: '000000' } },
		};
	}

	calculateSummaryStats() {
		const passedCount = this.testResults.filter(test => test.status === 'PASSED').length;
		const failedCount = this.testResults.filter(test => test.status === 'FAILED').length;
		const totalCount = this.testResults.length;

		return [
			{ metric: 'Total Tests', value: totalCount },
			{ metric: 'Passed Tests', value: passedCount },
			{ metric: 'Failed Tests', value: failedCount },
		];
	}

	/**
	 * Creates a text-formatted summary for use in a GitHub job summary, if desired.
	 */
	writeSummaryInTextFile(filePath) {
		const testSummary = this.calculateSummaryStats()
			.map(data => Object.values(data))
			.map(values => `${values[0]}: ${values[1]}`)
			.join(', ');
		filePath = `${filePath}/test-summary.txt`;
		fs.writeFileSync(filePath, '');
		fs.appendFileSync(filePath, testSummary);
	}
}
