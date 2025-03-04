# {{Project name}} Automation Framework

This Test Automation framework is designed to {{Project name}}

## Installation

**Prerequisites**

1.  Install Visual studio code
2.  Install node latest version

## Run Locally

Clone the project

```

git clone https://github.com/testingmavens/ui_automation_template_repository.git

```

Open the project folder

Open the Command Prompt

Enter the below command to install the dependencies

```

npm i

```

To run the script

```

npm run test

```

To view the report

```

npm run openReport

```

## Running from Github Actions

To run the workflow from actions tab

```

Go to the link https://github.com/testingmavens/ui_automation_template_repository.git

```

-   Click on Action tab ![action_tab](./assets/actions.png)

-   Click on "WebdriverIO CI" ![WebdriverIO_CI](./assets/select_workflow.png)

-   Click on Run workflow dropdown ![run_workflow](./assets/run_workflow.png)

-   Select main Branch (Default value) and click on Run workflow : The live Test Execution status can be
    monitored in console view

## To Open the Report after Execution

-   Make sure the execution is Completed by checking the execution status ![status](./assets/execution_status.png)

-   Open the completed task by clicking on it and Click on "**Allure report**" zip file under "**Artifacts**" at the end of the run summary page to download the Report : ![report](./assets/runreport.png)

-   Unzip the downloaded "**Allure report.zip**" and open the "_complete.html_" to view
    the run report. ![final_report](./assets/final_report.png)
    ![allure_report](./assets/allure_report.png)
