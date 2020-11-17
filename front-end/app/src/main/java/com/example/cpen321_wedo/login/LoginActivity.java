package com.example.cpen321_wedo.login;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.example.cpen321_wedo.R;
import com.example.cpen321_wedo.TaskListActivity;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.rengwuxian.materialedittext.MaterialEditText;

public class LoginActivity extends AppCompatActivity {
    private MaterialEditText email;
    private MaterialEditText password;

    private FirebaseAuth auth;

    private boolean isEmailFilled;
    private boolean isPasswordFilled;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

//        Toolbar toolbar = findViewById(R.id.toolbar);
//        setSupportActionBar(toolbar);
//        getSupportActionBar().setTitle("Login");
//        getSupportActionBar().setDisplayHomeAsUpEnabled(true);


        auth = FirebaseAuth.getInstance();

        email = findViewById(R.id.email);
        password = findViewById(R.id.password);
        isEmailFilled = false;
        isPasswordFilled = false;

        Button btn_login = findViewById(R.id.btn_login);
        btn_login.setEnabled(false);

        btn_login.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String txt_email = email.getText().toString();
                String txt_password = password.getText().toString();

                if(TextUtils.isEmpty(txt_email) || TextUtils.isEmpty(txt_password)){
                    Toast.makeText(LoginActivity.this, "All fields are required", Toast.LENGTH_SHORT).show();
                }else{
                    auth.signInWithEmailAndPassword(txt_email, txt_password)
                            .addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                                @Override
                                public void onComplete(@NonNull Task<AuthResult> task) {
                                    if(task.isSuccessful()){
                                        Intent intent = new Intent(LoginActivity.this, TaskListActivity.class);
                                        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                                        startActivity(intent);
                                        finish();
                                    }else{
                                        Toast.makeText(LoginActivity.this, "Authentication failed", Toast.LENGTH_LONG).show();
                                    }
                                }
                            });
                }
            }
        });

        email.addTextChangedListener(new TextValidator(email, btn_login) {
            @Override
            public void validate(TextView textView, String text, Button buttonView) {
                if (text != null && !text.isEmpty()) {
                    isEmailFilled = true;
                } else {
                    isEmailFilled = false;
                }

                if (isEmailFilled && isPasswordFilled) {
                    buttonView.setEnabled(true);
                } else {
                    buttonView.setEnabled(false);
                }
            }
        });

        password.addTextChangedListener(new TextValidator(password, btn_login) {
            @Override
            public void validate(TextView textView, String text, Button buttonView) {
                if (text != null && !text.isEmpty()) {
                    isPasswordFilled = true;
                } else {
                    isPasswordFilled = false;
                }

                if (isEmailFilled && isPasswordFilled) {
                    buttonView.setEnabled(true);
                } else {
                    buttonView.setEnabled(false);
                }
            }
        });
    }
}