package com.example.cpen321_wedo;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import org.w3c.dom.Text;

public class SignupActivity extends AppCompatActivity {
    TextView name;
    TextView email;
    TextView password1;
    TextView password2;
    Button signup;
    Button login;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);

        name = (TextView) findViewById(R.id.nameSignupTextView);
        email = (TextView) findViewById(R.id.emailSignupTextView);
        password1 = (TextView) findViewById(R.id.passwordLoginTextView);
        password2 = (TextView) findViewById(R.id.reenterPasswordSignupTextView);

        signup = (Button) findViewById(R.id.SignupNewButton);
        login = (Button) findViewById(R.id.toLoginInSignupButton);

        signup.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //TODO: Get the string of those four textView, assert that they are not null, assert that password1 is equal to password2, then sent post http to backend.

                Intent taskListIntent = new Intent(SignupActivity.this, TaskListActivity.class);
                startActivity(taskListIntent);
            }
        });

        login.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //TODO: Get the string of those four textView, assert that they are not null, assert that password1 is equal to password2, then sent post http to backend.

                Intent logInIntent = new Intent(SignupActivity.this, LoginActivity.class);
                startActivity(logInIntent);
            }
        });
    }
}
