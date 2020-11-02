package com.example.cpen321_wedo.Models;

// TODO: need to modified the Tasklist class if we change backend as well
public class TaskList {

    private String taskListName;
    private int userCap;
    private String description;
    private int Thumbnail;

    public TaskList(){

    }

    public TaskList(String taskListName, String description, int userCap) {
        this.taskListName = taskListName;
        this.userCap = userCap;
        this.description = description;
    }

    public TaskList(String taskListName, int userCap, String description, int thumbnail) {
        this.taskListName = taskListName;
        this.userCap = userCap;
        this.description = description;
        Thumbnail = thumbnail;
    }

    public String getTaskListName() {
        return taskListName;
    }

    public int getUserCap() {
        return userCap;
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

    public void setUserCap(int userCap) {
        this.userCap = userCap;
    }


    public void setDescription(String description) {
        this.description = description;
    }

    public void setThumbnail(int thumbnail) {
        Thumbnail = thumbnail;
    }
}
