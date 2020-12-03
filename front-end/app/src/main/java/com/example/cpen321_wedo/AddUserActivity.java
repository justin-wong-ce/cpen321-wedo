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
import com.example.cpen321_wedo.notifications.NotificationType;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.Query;
import com.google.firebase.database.ValueEventListener;

import java.util.HashMap;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AddUserActivity extends AppCompatActivity {

    private TextView user_email;
    private FirebaseUser firebaseUser;
    private APIService apiService;
    private boolean friends;
    private String taskListName;
    private String taskListDescription;
    private String taskListID;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_friend);

        user_email = findViewById(R.id.user_email);
        firebaseUser = FirebaseAuth.getInstance().getCurrentUser();
        apiService = MyClientUtil.getClient("https://fcm.googleapis.com/").create(APIService.class);
        friends = getIntent().getBooleanExtra("Friends", true);

        if(!friends){
            taskListName = getIntent().getStringExtra("tasklistName");
            taskListDescription = getIntent().getStringExtra("tasklistDescription");
            taskListID = getIntent().getStringExtra("tasklistID");
        }

        TextView title = findViewById(R.id.addingAttribute);
        title.setText(friends?"Add Friend":"Add Other User to this TaskList");

        Button btn_add = findViewById(R.id.btn_add_user);

        btn_add.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String txt_user_email = user_email.getText().toString();
                if(!TextUtils.isEmpty(txt_user_email)){
                    //TODO: write to the online database here

                    getUserID(txt_user_email);
                }
            }
        });
    }

    private void getUserID(final String email){
        String newemail = email.replaceAll("\\.", "\\_");
        FirebaseDatabase.getInstance().getReference("emailToID").child(newemail).addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshots) {
                String userID = "";
                for(DataSnapshot snapshot: snapshots.getChildren()){

                    userID = snapshot.getValue(String.class);
                }

                if(friends){
                    addFriend(userID);
                }else{
                    addTaskList(userID);
                }
                sendNotifications(userID, email);
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.d("test", "user cancelled");
            }
        });
    }

    private void addFriend(String userID){
        DatabaseReference reference = FirebaseDatabase.getInstance().getReference();

        HashMap<String, String> hashMap = new HashMap<>();
        hashMap.put("id",firebaseUser.getUid());
        hashMap.put("username", firebaseUser.getEmail());
        hashMap.put("imageURL", "default");

        reference.child("FriendRequest").child(userID).child(firebaseUser.getUid()).setValue(hashMap);
    }

    private void addTaskList(String userID){
        DatabaseReference reference = FirebaseDatabase.getInstance().getReference();

        HashMap<String, String> hashMap = new HashMap<>();
        hashMap.put("id", taskListID);
        hashMap.put("username", firebaseUser.getEmail());
        hashMap.put("tasklistName", taskListName);
        hashMap.put("tasklistDescription", taskListDescription);
        hashMap.put("ownerID",firebaseUser.getUid());

        reference.child("TaskListRequest").child(userID).child(taskListID).setValue(hashMap);
    }


    private void sendNotifications(final String receiver, final String username){
        DatabaseReference tokens = FirebaseDatabase.getInstance().getReference("Tokens");

        Query query = tokens.orderByKey().equalTo(receiver);
        query.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshots) {

                for(DataSnapshot snapshot: snapshots.getChildren()){
                    Token token = snapshot.getValue(Token.class);
                    assert token != null;
                    Data data;
                    if(friends){
                        data = new Data(firebaseUser.getUid(), R.mipmap.ic_launcher, username+" send you a friend request ", "Friend Request", receiver, NotificationType.ADDFRIEND);
                    }else{
                        data = new Data(firebaseUser.getUid(), R.mipmap.ic_launcher, firebaseUser.getEmail()+" ask you to work together on a tasklist ", "Work Together", receiver, NotificationType.WORKTOGETHER);
                    }
                    Sender sender = new Sender(data, token.getToken());
                    Log.d("test", token.getToken());
                    apiService.sendNotification(sender)
                            .enqueue(new Callback<MyResponse>() {
                                @Override
                                public void onResponse(Call<MyResponse> call, Response<MyResponse> response) {
                                    if(response.code() == 200) {
                                        assert response.body() != null;
                                        if (response.body().success==1) {
                                            Toast.makeText(AddUserActivity.this, "Not sure if it's failed or succeed", Toast.LENGTH_SHORT).show();

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