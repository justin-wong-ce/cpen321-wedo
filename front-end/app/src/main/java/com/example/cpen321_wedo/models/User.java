package com.example.cpen321_wedo.models;

public class User {
    private String id;
    private String username;
    private String imageURL;
    private boolean isGroupChatUser;

    public User(String id, String username, String imageURL) {
        this.id = id;
        this.username = username;
        this.imageURL = imageURL;
        this.isGroupChatUser = false;
    }

    public User(String id, String username, String imageURL, boolean isGroupChatUser) {
        this.id = id;
        this.username = username;
        this.imageURL = imageURL;
        this.isGroupChatUser = isGroupChatUser;
    }

    public User(){

    }

    public boolean isGroupChatUser() {
        return isGroupChatUser;
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getImageURL() {
        return imageURL;
    }
}
