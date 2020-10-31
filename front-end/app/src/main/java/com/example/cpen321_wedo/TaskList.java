package com.example.cpen321_wedo;


public class TaskList {

    private String taskListName;
    private int userCap;
    private String Category;
    private String description;
    private int Thumbnail;

    public TaskList(){

    }

    public TaskList(String taskListName, int userCap, String category, String description, int thumbnail) {
        this.taskListName = taskListName;
        this.userCap = userCap;
        Category = category;
        this.description = description;
        Thumbnail = thumbnail;
    }

    public String getTaskListName() {
        return taskListName;
    }

    public int getUserCap() {
        return userCap;
    }

    public String getCategory() {
        return Category;
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

    public void setCategory(String category) {
        Category = category;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setThumbnail(int thumbnail) {
        Thumbnail = thumbnail;
    }
}
