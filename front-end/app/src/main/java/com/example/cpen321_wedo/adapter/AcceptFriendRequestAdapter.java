package com.example.cpen321_wedo.adapter;

import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.cpen321_wedo.GoBackInterface;
import com.example.cpen321_wedo.R;
import com.example.cpen321_wedo.models.User;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.FirebaseDatabase;

import java.util.List;
import java.util.Random;

public class AcceptFriendRequestAdapter extends RecyclerView.Adapter<AcceptFriendRequestAdapter.MyViewHolder>{

    private final Context mContext;
    private final List<User> mData;
    private final FirebaseUser firebaseUser;
    private final GoBackInterface goBackInterface;

    public AcceptFriendRequestAdapter(Context mContext, List<User> mData, GoBackInterface goBackInterface){
        this.mContext = mContext;
        this.mData = mData;
        firebaseUser = FirebaseAuth.getInstance().getCurrentUser();
        this.goBackInterface = goBackInterface;
    }

    @NonNull
    @Override
    public AcceptFriendRequestAdapter.MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view;
        LayoutInflater mInflater = LayoutInflater.from(mContext);
        view = mInflater.inflate(R.layout.accept_friends_request_item, parent, false);

        return new AcceptFriendRequestAdapter.MyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull final AcceptFriendRequestAdapter.MyViewHolder holder, int position) {
        holder.user_email.setText(mData.get(position).getUsername());
        // if you want image here:
        if(mData.get(position).getImageURL().equals("default")){
            holder.profile_image.setImageResource(R.mipmap.ic_launcher);
        }else{
            Glide.with(mContext).load(mData.get(position).getImageURL()).into(holder.profile_image);
        }

        holder.userID = mData.get(position).getId();

        Random rnd = new Random();
        int color = Color.argb(255, rnd.nextInt(256), rnd.nextInt(256), rnd.nextInt(256));
        holder.colorView.setBackgroundColor(color);

        holder.btn_decline.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String txt_user_email = firebaseUser.getEmail();
                txt_user_email = txt_user_email.replaceAll("\\.", "\\_");

                FirebaseDatabase.getInstance().getReference().child("FriendRequest").child(txt_user_email).child(holder.userID).removeValue();
                goBackInterface.goBack();
            }
        });

        holder.btn_accept.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                FirebaseDatabase.getInstance().getReference().child("UsersFriends").child(firebaseUser.getUid()).child(holder.userID).setValue(holder.userID);
                FirebaseDatabase.getInstance().getReference().child("UsersFriends").child(holder.userID).child(firebaseUser.getUid()).setValue(firebaseUser.getUid());

                String firebaseUserUid = firebaseUser.getUid();

                FirebaseDatabase.getInstance().getReference().child("FriendRequest").child(firebaseUserUid).child(holder.userID).removeValue();
                goBackInterface.goBack();
            }
        });

    }

    @Override
    public int getItemCount() {
        return mData.size();
    }

    public static class MyViewHolder extends RecyclerView.ViewHolder {

        public TextView user_email;
        public ImageView profile_image;
        public Button btn_decline;
        public Button btn_accept;
        public String userID;
        public View colorView;

        public MyViewHolder(View itemView) {
            super(itemView);

            user_email = itemView.findViewById(R.id.user_request_email);
            profile_image = itemView.findViewById(R.id.user_profile_image);
            btn_decline = itemView.findViewById(R.id.btn_decline);
            btn_accept = itemView.findViewById(R.id.btn_accept);
            colorView = itemView.findViewById(R.id.color_view);
        }
    }
}
