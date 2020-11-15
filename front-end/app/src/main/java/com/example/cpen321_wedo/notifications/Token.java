package com.example.cpen321_wedo.notifications;

public class Token {
    private String token;
    private String userID;

    public Token(String token, String userID) {
        this.token = token;
        this.userID = userID;
    }



    public Token(){

    }

    public String getToken() {
        return token;
    }
    public String getUserID() {
        return userID;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
