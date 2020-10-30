package com.example.cpen321_wedo;

import androidx.appcompat.app.AppCompatActivity;

import android.app.VoiceInteractor;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;

public class LoginActivity extends AppCompatActivity{

    Button login;
    Button signup;
    TextView email;
    TextView password;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        // if the user has already log in and not log out, then switch to TaskListActivity directly
        SharedPreferences preferences = getApplicationContext().getSharedPreferences("LoginSignup", Context.MODE_PRIVATE);
        if(preferences.getBoolean("haslogin",false)){
            Intent taskListIntent = new Intent(LoginActivity.this, TaskListActivity.class);
            startActivity(taskListIntent);
        }

        login = (Button) findViewById(R.id.loginButton);
        signup = (Button) findViewById(R.id.signupButton);
        email = (TextView) findViewById(R.id.emailLoginTextView);
        password = (TextView) findViewById(R.id.passwordLoginTextView);

        final RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        final String url = "http://40.78.89.252:3000/user/login";

        login.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String email_str = email.getText().toString();
                String password_str = password.getText().toString();
                //TODO: try to varify that email address is value later.


                JSONObject object = new JSONObject();
                try{
                    object.put("userID", Integer.parseInt(email_str));
                    object.put("password", password_str);
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                Log.d("http", object.toString());
                JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, object,
                        new Response.Listener<JSONObject>() {
                            @Override
                            public void onResponse(JSONObject response) {

                                // save the status to local storage, if hasLogin is false, then means
                                // user has logged out; otherwise, user has logged in. Also gonna
                                // save token to local storage.
                                boolean login = true;
                                SharedPreferences preferences = getApplicationContext().getSharedPreferences("LoginSignup", Context.MODE_PRIVATE);
                                SharedPreferences.Editor editor = preferences.edit();
                                editor.putBoolean("haslogin", login);
                                try {
                                    editor.putString("token", (String) response.get("token"));
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                                editor.apply();

                                Toast.makeText(getApplicationContext(), "I am OK !" + response.toString(), Toast.LENGTH_LONG).show();
                                Log.d("http", response.toString());
                                Intent taskListIntent = new Intent(LoginActivity.this, TaskListActivity.class);
                                startActivity(taskListIntent);
                            }
                        }, new Response.ErrorListener(){
                            @Override
                            public void onErrorResponse(VolleyError error) {
                                //TODO: error handler, display error with pop out message
                                Log.d("http", error.toString());
                                Toast.makeText(getApplicationContext(), "Error: " + error.toString(), Toast.LENGTH_LONG).show();
                            }
                });

                queue.add(jsonObjectRequest);


            }
        });

        signup.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                Intent signupIntent = new Intent(LoginActivity.this, SignupActivity.class);
                startActivity(signupIntent);
            }
        });
    }

}