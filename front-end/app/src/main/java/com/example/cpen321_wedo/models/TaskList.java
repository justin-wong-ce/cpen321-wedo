package com.example.cpen321_wedo.models;

// TODO: need to modified the Tasklist class if we change backend as well
public class TaskList {

    private String taskListName;
    private String description;
    private int Thumbnail;

    public TaskList(){

    }

    public TaskList(String taskListName, String description) {
        this.taskListName = taskListName;
        this.description = description;
    }

    public TaskList(String taskListName, String description, int thumbnail) {
        this.taskListName = taskListName;
        this.description = description;
        Thumbnail = thumbnail;
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
