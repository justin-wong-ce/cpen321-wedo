package com.example.cpen321_wedo;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;
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

        final RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        final String url = "http://40.78.89.252:3000/user/singup";

        signup.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String name_str = name.getText().toString();
                String email_str = email.getText().toString();
                String password1_str = password1.getText().toString();
                String password2_str = password2.getText().toString();
                //TODO: Get the string of those four textView, assert that they are not null, assert that password1 is equal to password2, then sent post http to backend.



                if(!password1_str.equals(password2_str)){
                    Toast.makeText(getApplicationContext(), "password reentered is not the same as password", Toast.LENGTH_LONG).show();
                }

                JSONObject object = new JSONObject();
                try{
                    object.put("userName", name_str);
                    object.put("userID", Integer.parseInt(email_str));
                    object.put("password", password1_str);
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                Log.d("http", object.toString());
                JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, object,
                        new Response.Listener<JSONObject>() {
                            @Override
                            public void onResponse(JSONObject response) {
                                Toast.makeText(getApplicationContext(), "Created new User!" + response.toString(), Toast.LENGTH_LONG).show();
                                Log.d("http", response.toString());
                                Intent taskListIntent = new Intent(SignupActivity.this, TaskListActivity.class);
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
