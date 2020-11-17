package com.example.cpen321_wedo.adapter;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.PopupMenu;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.cpen321_wedo.AddUserActivity;
import com.example.cpen321_wedo.R;
import com.example.cpen321_wedo.TaskActivity;
import com.example.cpen321_wedo.models.TaskList;

import java.util.List;
import java.util.Random;

public class TaskListAdapter extends RecyclerView.Adapter<TaskListAdapter.MyViewHolder> {

    private final Context mContext;
    private final List<TaskList> mData;

    public TaskListAdapter(Context mContext, List<TaskList> mData){
        this.mContext = mContext;
        this.mData = mData;
    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view;
        LayoutInflater mInflater = LayoutInflater.from(mContext);
        view = mInflater.inflate(R.layout.task_list_view_item, parent, false);

        return new MyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull final MyViewHolder holder, final int position) {
        holder.tv_tasklist.setText(mData.get(position).getTaskListName());
        // if you want image here:
        //holder.img_tasklist_thumbnail.setImageResource(mData.get(position).getThumbnail());
        Random rnd = new Random();
        int color = Color.argb(255, rnd.nextInt(256), rnd.nextInt(256), rnd.nextInt(256));
        holder.colorView.setBackgroundColor(color);

        holder.cardView.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v){
                Intent intent = new Intent(mContext, TaskActivity.class);
                mContext.startActivity(intent);

            }
        });

        holder.menuView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                //creating a popup menu
                PopupMenu popup = new PopupMenu(mContext, holder.menuView);
                //inflating menu from xml resource
                popup.inflate(R.menu.tasklist_options_memu);
                //adding click listener
                popup.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {
                    @SuppressLint("NonConstantResourceId")
                    @Override
                    public boolean onMenuItemClick(MenuItem item) {
                        switch (item.getItemId()) {
                            case R.id.menu1:
                                Intent intent = new Intent(mContext, AddUserActivity.class);
                                intent.putExtra("Friends", false);
                                intent.putExtra("tasklistName", mData.get(position).getTaskListName());
                                intent.putExtra("tasklistDescription", mData.get(position).getDescription());
                                intent.putExtra("tasklistID", mData.get(position).getTaskListID());
                                mContext.startActivity(intent);
                                break;
                            case R.id.menu2:
                                //handle menu2 click
                                break;
                            case R.id.menu3:
                                //handle menu3 click
                                break;
                            default:
                                break;
                        }
                        return false;
                    }
                });
                //displaying the popup
                popup.show();

            }
        });

    }

    @Override
    public int getItemCount() {
        Log.d("test", mData.size()+"");
        return mData.size();
    }

    public static class MyViewHolder extends RecyclerView.ViewHolder {

        private final TextView tv_tasklist;
//        ImageView img_tasklist_thumbnail;
        private final View cardView;
        private final View colorView;
        private final View menuView;

        public MyViewHolder(View itemView) {
            super(itemView);

            tv_tasklist = itemView.findViewById(R.id.tasklist_title_id);
            //img_tasklist_thumbnail = (ImageView) itemView.findViewById(R.id.tasklist_image_id);
            cardView = itemView.findViewById(R.id.cardview_id);
            colorView = itemView.findViewById(R.id.color_view);
            menuView = itemView.findViewById(R.id.memu_options);
        }
    }
}
