package com.example.cpen321_wedo.models;

// TODO: need to modified the Tasklist class if we change backend as well
public class TaskList {

    private String taskListName;
    private String description;
    private int Thumbnail;
    private String taskListID;

    public TaskList(){

    }

    public TaskList(String taskListName, String description, String taskListID) {
        this.taskListName = taskListName;
        this.description = description;
        this.taskListID = taskListID;
    }

    public TaskList(String taskListName, String description, String taskListID, int thumbnail) {
        this.taskListName = taskListName;
        this.description = description;
        Thumbnail = thumbnail;
        this.taskListID = taskListID;
    }

    public String getTaskListID() {
        return taskListID;
    }

    public void setTaskListID(String taskListID) {
        this.taskListID = taskListID;
    }

    public String getTaskListName() {
        return taskListName;
    }


    public String getDescription() {
        return description;
    }

    public int getThumbnail() {
        return Thumbnail;
    }

    public void setTaskListName(String taskListName) {
        this.taskListName = taskListName;
    }


    public void setDescription(String description) {
        this.description = description;
    }

    public void setThumbnail(int thumbnail) {
        Thumbnail = thumbnail;
    }
}
