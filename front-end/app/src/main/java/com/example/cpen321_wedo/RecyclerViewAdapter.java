package com.example.cpen321_wedo;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class RecyclerViewAdapter extends RecyclerView.Adapter<RecyclerViewAdapter.MyViewHolder> {

    private Context mContext;
    private List<TaskList> mData;

    public RecyclerViewAdapter(Context mContext, List<TaskList> mData){
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
    public void onBindViewHolder(@NonNull MyViewHolder holder, int position) {
        holder.tv_tasklist.setText(mData.get(position).getTaskListName());
        holder.img_tasklist_thumbnail.setImageResource(mData.get(position).getThumbnail());

        holder.cardView.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v){
                Log.d("test", "pressed a tasklist");
            }
        });
    }

    @Override
    public int getItemCount() {
        return mData.size();
    }

    public static class MyViewHolder extends RecyclerView.ViewHolder {

        TextView tv_tasklist;
        ImageView img_tasklist_thumbnail;
        View cardView;

        public MyViewHolder(View itemView) {
            super(itemView);

            tv_tasklist = (TextView) itemView.findViewById(R.id.tasklist_title_id);
            img_tasklist_thumbnail = (ImageView) itemView.findViewById(R.id.tasklist_image_id);
            cardView = itemView.findViewById(R.id.cardview_id);
        }
    }
}
