package com.example.cpen321_wedo;

import org.json.JSONException;

public interface GetSelected {
    public void onAdd(String address);
    public void onDelete(String address) throws JSONException;
}
