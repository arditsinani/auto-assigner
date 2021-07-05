# Auto Assigner

This is a simple auto assigner project that consists in creating issues and assigning them to agents automatically. The system is simple to setup.

## Dependencies
You should have **docker** and **make** installed

## Steps
```
    make build
```
```
    make up mongo rabbitmq
```
The dependencies and the server can be started with **make up** both, but since RabbitMQ takes a while to start, wait a bit before starting the server
```
    make up back
```
Populate the Agents table with the following command:
```
    make populate-agents
```

Now you have 3 agents in the database that are in offline mode.
When a new Issue is created, it will be inserted in a queue and will be stored there until an agent will be updated in online mode, which will be automatically signed to this agent.
The issue will remain assigned to this agent unless resolved.

## Endpoints

### Issue
```
    Create Issue
    POST localhost:8000/api/issue/create
    payload => {
        "creator": string,
        "description": string
    }
```

### Agent
```
    Get agents
    GET localhost:8000/api/agent/get
```
```
    Update status
    POST localhost:8000/api/agent/{id}/update/status
```
```
    Resolve issue
    POST localhost:8000/api/agent/{id}/issue/{issueId}/resolve
```
