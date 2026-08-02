# computer use standalone tool

> Ref. <br/>
[MS Learn: Add computer use standalone tools to agents and agent flows (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/computer-use-standalone)<br/>
[MS Learn: Automate web and desktop apps with computer use - local in-agent computer use tool](https://learn.microsoft.com/en-us/microsoft-copilot-studio/computer-use)

comment by Nathan Backers: "Nice little feature drop, you can now use CUA as a standalone action inside an agent flow. Great if you have set up a reusable CUA that you want to use across multiple deterministic processes (e.g. invoice processing). One thing I've noticed is that it only works for agent flows created in the agent flow designer, you cannot add the action in existing Power Automate flows or the new workflows canvas. That option is a bit harder to find since they introduced workflows"

## Create computer use standalone tool
![alt text](image-4.png)

## Configure computer use standalone tool
### Overview
The Overview tab acts as the identity card for the tool.

### Designer
The Designer tab is where you build the logic of your tool.
- Model: Select the model that powers the automation.
- Instructions: Write the natural language guidance the AI follows to perform UI tasks.
- Parameters: Define input and output parameters to pass data into the tool or extract results for downstream steps in a flow.
- Stored credentials: Securely configure authentication for the websites or apps the tool needs to access.
- Allowed websites and desktop apps: Define an allow list of specific sites and applications the tool is permitted to interact with.
- Human supervision: Trigger human-in-the-loop notifications for steps that require manual validation or more information.
  - ![alt text](image-11.png)
  - ![alt text](image-12.png)
- Test: Use the built-in sandbox to run your instructions and see how the AI reacts in real-time.
  - ![alt text](image-5.png)
  - ![alt text](image-6.png)
  - ![alt text](image-7.png)
  - ![alt text](image-8.png)
  - ![alt text](image-9.png)
  - ![alt text](image-10.png)

### Activity
The Activity tab provides deep observability for debugging and optimization. It lists all runs from the last 28 days.
- Session replay: Watch a recording of the AI's interaction with the interface.
- Screenshots: Review every screen captured during execution.
- Step logs: See the exact sequence of actions taken by the tool.
- Metrics: Analyze execution time and success rates.
  - ![alt text](image-13.png)
  - ![alt text](image-14.png)

## Add a standalone computer use tool to an agent flow
- not working currently..

## Add a standalone computer use tool to an agent
![alt text](image-15.png)


![alt text](image-16.png)
![alt text](image-19.png)
![alt text](image-17.png)
![alt text](image-18.png)
![alt text](image-20.png)
![alt text](image-21.png)
![alt text](image-22.png)
![alt text](image-23.png)
![alt text](image-24.png)
![alt text](image-25.png)
![alt text](image-26.png)