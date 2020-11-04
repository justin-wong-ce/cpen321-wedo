package com.example.cpen321_wedo.Models;

import java.util.Date;

public class Task {
    private  String taskName;
    private String taskDescription;
    private String taskLocation;
    private boolean completed;
    private long dateCreatedInSeconds;

    public String getTaskLocation() {
        return taskLocation;
    }

    public void setTaskLocation(String taskLocation) {
        this.taskLocation = taskLocation;
    }

    public Task(String taskName, String taskLocation, String taskDescription) {
        this.taskName = taskName;
        this.taskDescription = taskDescription;
        this.taskLocation = taskLocation;
        this.completed = false;

        Date date = new Date();
        this.dateCreatedInSeconds = date.getTime();
    }

    public String getTaskName() {
        return taskName;
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

    public long getDateCreatedInSeconds() {
        return dateCreatedInSeconds;
    }
}