package com.example.cpen321_wedo;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.example.cpen321_wedo.notifications.APIService;
import com.example.cpen321_wedo.notifications.Data;
import com.example.cpen321_wedo.notifications.MyClientUtil;
import com.example.cpen321_wedo.notifications.MyResponse;
import com.example.cpen321_wedo.notifications.Sender;
import com.example.cpen321_wedo.notifications.Token;
import com.example.cpen321_wedo.notifications.notificationType;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.Query;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AddFriendActivity extends AppCompatActivity {

    private TextView user_email;
    private FirebaseUser firebaseUser;
    private APIService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_friend);

        user_email = findViewById(R.id.user_email);
        firebaseUser = FirebaseAuth.getInstance().getCurrentUser();
        apiService = MyClientUtil.getClient("https://fcm.googleapis.com/").create(APIService.class);

        Button btn_add = findViewById(R.id.btn_add_user);

        btn_add.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String txt_user_email = user_email.getText().toString();
                if(!TextUtils.isEmpty(txt_user_email)){
                    //TODO: write to the online database here

                    AddFriend(txt_user_email);

                    sendNotifications(txt_user_email, "Fuck");


//                    finish();
                }
            }
        });
    }

    private void AddFriend(String txt_user_email){
        Log.d("test", "btn pressed");
        DatabaseReference reference = FirebaseDatabase.getInstance().getReference();

        HashMap<String, String> hashMap = new HashMap<>();
        hashMap.put("id",firebaseUser.getUid());
        hashMap.put("username", txt_user_email);
        hashMap.put("imageURL", "default");

        txt_user_email = txt_user_email.replaceAll("\\.", "\\_");
        Log.d("test", txt_user_email);

        reference.child("FriendRequest").child(txt_user_email).child(firebaseUser.getUid()).setValue(hashMap);
    }


    private void sendNotifications(String receiver, final String username){
        DatabaseReference tokens = FirebaseDatabase.getInstance().getReference("Tokens");

        receiver = receiver.replaceAll("\\.", "\\_");
        Log.d("test", receiver);
        Query query = tokens.orderByKey().equalTo(receiver);
        query.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshots) {

                for(DataSnapshot snapshot: snapshots.getChildren()){
                    Token token = snapshot.getValue(Token.class);
                    assert token != null;

                    Data data = new Data(firebaseUser.getUid(), R.mipmap.ic_launcher, username+" send you a friend request ", "New Message", token.getUserID(), notificationType.ADDFRIEND);
                    Sender sender = new Sender(data, token.getToken());
                    Log.d("test", token.getToken());
                    apiService.sendNotification(sender)
                            .enqueue(new Callback<MyResponse>() {
                                @Override
                                public void onResponse(Call<MyResponse> call, Response<MyResponse> response) {
                                    if(response.code() == 200) {
                                        assert response.body() != null;
                                        if (response.body().success==1) {
                                            Toast.makeText(AddFriendActivity.this, "Failed", Toast.LENGTH_SHORT).show();

                                        }
                                    }
                                }

                                @Override
                                public void onFailure(Call<MyResponse> call, Throwable t) {
                                    Log.d("test", "cannot send notification, there is an error");
                                }
                            });
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.d("test", error.toString());
            }
        });
    }
}