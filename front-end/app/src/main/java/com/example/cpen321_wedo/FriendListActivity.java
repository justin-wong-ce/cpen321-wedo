package com.example.cpen321_wedo;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;

import com.example.cpen321_wedo.adapter.UserAdapter;
import com.example.cpen321_wedo.models.User;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.List;

public class FriendListActivity extends AppCompatActivity {
    private List<User> mUsers;
    private UserAdapter userAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_friend_list);

        Context mContext = this;

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("Chat");


        RecyclerView recyclerView = findViewById(R.id.recyclerview_view);
        recyclerView.setLayoutManager(new LinearLayoutManager(mContext));

        mUsers = new ArrayList<>();

        userAdapter = new UserAdapter(mContext, mUsers);
        recyclerView.setAdapter(userAdapter);

        readUsers();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.chat_menu, menu);
        return true;
    }

    @SuppressLint("NonConstantResourceId")
    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        switch (item.getItemId()){
            case R.id.logout:
                FirebaseAuth.getInstance().signOut();
                startActivity(new Intent(FriendListActivity.this, StartActivity.class));
                finish();
                return true;
            case R.id.addFriend:
                Intent intent = new Intent(FriendListActivity.this, AddUserActivity.class);
                intent.putExtra("Friends", true);
                startActivity(intent);
                return true;
            case R.id.acceptRequest:
                startActivity(new Intent(FriendListActivity.this, AcceptFriendsActivity.class));
                return true;
            default:
                break;
        }
        return false;
    }



    private void readUsers(){
        final FirebaseUser firebaseUser = FirebaseAuth.getInstance().getCurrentUser();

        DatabaseReference reference = FirebaseDatabase.getInstance().getReference("UsersFriends").child(firebaseUser.getUid());


        reference.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshots) {
                mUsers.clear();
                for(DataSnapshot snapshot: snapshots.getChildren()){
                    String userID = snapshot.getValue(String.class);

                    Log.d("test", userID);

                    //TODO: this looks very very very very ugly, but it's okay cause we have reasonalbe number of users
                    FirebaseDatabase.getInstance().getReference("Users").child(userID).addValueEventListener(new ValueEventListener() {
                        @Override
                        public void onDataChange(DataSnapshot dataSnapshot) {
                            User user = dataSnapshot.getValue(User.class);
                            Log.d("test", user.getUsername());
                            mUsers.add(user);
                            userAdapter.notifyDataSetChanged();
                        }

                        @Override
                        public void onCancelled(DatabaseError databaseError) {
                            System.out.println("The read failed: " + databaseError.getCode());
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