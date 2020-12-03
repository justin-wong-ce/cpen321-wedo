package com.example.cpen321_wedo.models;

import java.util.Date;

public class Task {
    private String taskId;
    private  String taskName;
    private String taskDescription;
    private String taskLocation;
    private String taskType;
    private boolean completed;
    private long dateCreatedInMilliSeconds;
    private long dateModifiedInMilliSeconds;

    public String getTaskLocation() {
        return taskLocation;
    }

    public void setTaskLocation(String taskLocation) {
        this.taskLocation = taskLocation;
    }

    // This is for test:
    public Task(String taskName, String taskLocation) {
        this.taskName = taskName;
        this.taskLocation = taskLocation;
        this.completed = false;
        this.taskType = "";
        this.taskId = "";
        this.taskDescription = "";

        Date date = new Date();
        this.dateCreatedInMilliSeconds = date.getTime();
        this.dateModifiedInMilliSeconds = this.dateCreatedInMilliSeconds;
    }

    public Task(String userId, String taskName, String taskLocation, String taskDescription, String taskType) {
        this.taskName = taskName;
        this.taskDescription = taskDescription;
        this.taskLocation = taskLocation;
        this.completed = false;
        this.taskType = taskType;

        Date date = new Date();
        this.dateCreatedInMilliSeconds = date.getTime();
        this.dateModifiedInMilliSeconds = this.dateCreatedInMilliSeconds;

        this.taskId= userId + dateCreatedInMilliSeconds;
    }

    public String getTaskName() {
        return this.taskName;
    }

    public String getTaskId() { return this.taskId; };

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getTaskDescription() {
        return taskDescription;
    }

    public void setTaskDescription(String taskDescription) {
        this.taskDescription = taskDescription;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public String getTaskType() {
        return taskType;
    }

    public void setTaskType(String taskType) {
        this.taskType = taskType;
    }

    public long getDateModifiedInMilliSeconds() {
        return dateModifiedInMilliSeconds;
    }

    public void setDateModifiedInMilliSeconds(long dateModifiedInMilliSeconds) {
        this.dateModifiedInMilliSeconds = dateModifiedInMilliSeconds;
    }

    public long getDateCreatedInMilliSeconds() {
        return dateCreatedInMilliSeconds;
    }

    @Override
    public boolean equals(Object o) {

        if (o == this) {
            return true;
        }

        if (!(o instanceof Task)) {
            return false;
        }

        Task c = (Task) o;

        return this.getTaskId().equals(c.getTaskId());
    }
}
