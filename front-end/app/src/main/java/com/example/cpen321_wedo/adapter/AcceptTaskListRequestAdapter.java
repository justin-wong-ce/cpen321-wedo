package com.example.cpen321_wedo.adapter;

import android.content.Context;
import android.graphics.Color;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.cpen321_wedo.R;
import com.example.cpen321_wedo.models.TaskListRequest;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.FirebaseDatabase;

import java.util.List;
import java.util.Random;

public class AcceptTaskListRequestAdapter extends RecyclerView.Adapter<AcceptTaskListRequestAdapter.MyViewHolder>{

    private final Context mContext;
    private final List<TaskListRequest> mData;
    private final FirebaseUser firebaseUser;

    public AcceptTaskListRequestAdapter(Context mContext, List<TaskListRequest> mData){
        this.mContext = mContext;
        this.mData = mData;
        firebaseUser = FirebaseAuth.getInstance().getCurrentUser();
    }

    @NonNull
    @Override
    public AcceptTaskListRequestAdapter.MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view;
        LayoutInflater mInflater = LayoutInflater.from(mContext);
        view = mInflater.inflate(R.layout.accept_tasklists_request_item, parent, false);

        return new AcceptTaskListRequestAdapter.MyViewHolder(view);
    }


    @Override
    public void onBindViewHolder(@NonNull final AcceptTaskListRequestAdapter.MyViewHolder holder, int position) {
        final TaskListRequest taskListRequest = mData.get(position);

        holder.title.setText(taskListRequest.getUsername()+" invites you to work on taskList "+taskListRequest.getTasklistName());
        holder.body.setText("Description: "+taskListRequest.getTasklistDescription());

        Random rnd = new Random();
        int color = Color.argb(255, rnd.nextInt(256), rnd.nextInt(256), rnd.nextInt(256));
        holder.colorView.setBackgroundColor(color);

        holder.btn_decline.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                FirebaseDatabase.getInstance().getReference().child("TaskListRequest").child(firebaseUser.getUid()).child(taskListRequest.getId()).removeValue();
            }
        });

        holder.btn_accept.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                holder.UserCanAccessTasklistBackend(firebaseUser.getUid(), taskListRequest.getId());
                FirebaseDatabase.getInstance().getReference().child("TaskListRequest").child(firebaseUser.getUid()).child(taskListRequest.getId()).removeValue();
            }
        });

    }


    @Override
    public int getItemCount() {
        return mData.size();
    }

    public static class MyViewHolder extends RecyclerView.ViewHolder {

        public TextView title;
        public TextView body;
        public Button btn_decline;
        public Button btn_accept;
        public View colorView;

        public MyViewHolder(View itemView) {
            super(itemView);

            title = itemView.findViewById(R.id.tasklist_request_title);
            body = itemView.findViewById(R.id.tasklist_request_description);
            btn_decline = itemView.findViewById(R.id.btn_decline);
            btn_accept = itemView.findViewById(R.id.btn_accept);
            colorView = itemView.findViewById(R.id.color_view);
        }

        public void UserCanAccessTasklistBackend(String userID, String tasklistID){
            //TODO: Add this to backend!!!!!!!!!!!!!!!!!!!!!!!!
        }
    }
}
