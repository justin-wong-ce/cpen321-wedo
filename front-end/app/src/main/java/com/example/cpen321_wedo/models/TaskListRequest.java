package com.example.cpen321_wedo.models;

public class TaskListRequest {
    private String id;
    private String username;
    private String tasklistName;
    private String tasklistDescription;
    private String ownerID;

    public String getOwnerID() {
        return ownerID;
    }

    public void setOwnerID(String ownerID) {
        this.ownerID = ownerID;
    }

    public TaskListRequest(String id, String username, String tasklistName, String tasklistDescription, String ownerID) {
        this.id = id;
        this.username = username;
        this.tasklistName = tasklistName;
        this.tasklistDescription = tasklistDescription;
        this.ownerID = ownerID;
    }

    public TaskListRequest(String id, String username, String tasklistName, String tasklistDescription) {
        this.id = id;
        this.username = username;
        this.tasklistName = tasklistName;
        this.tasklistDescription = tasklistDescription;
    }

    public TaskListRequest() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getTasklistName() {
        return tasklistName;
    }

    public void setTasklistName(String tasklistName) {
        this.tasklistName = tasklistName;
    }

    public String getTasklistDescription() {
        return tasklistDescription;
    }

    public void setTasklistDescription(String tasklistDescription) {
        this.tasklistDescription = tasklistDescription;
    }
}
