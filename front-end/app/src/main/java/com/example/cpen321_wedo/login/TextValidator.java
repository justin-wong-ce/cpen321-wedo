package com.example.cpen321_wedo.login;

import android.text.Editable;
import android.text.TextWatcher;
import android.widget.Button;
import android.widget.TextView;

public abstract class TextValidator implements TextWatcher {
    private final TextView textView;
    private final Button buttonView;

    public TextValidator(TextView textView, Button button) {
        this.textView = textView;
        buttonView = button;
        }

    public abstract void validate(TextView textView, String text, Button buttonView);

    @Override
    final public void afterTextChanged(Editable s) {
        String text = textView.getText().toString();
        validate(textView, text, buttonView);
    }

    @Override
    final public void beforeTextChanged(CharSequence s, int start, int count, int after) { /* Don't care */ }

    @Override
    final public void onTextChanged(CharSequence s, int start, int before, int count) {
        String text = textView.getText().toString();
        validate(textView, text, buttonView);
    }
}
