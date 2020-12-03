package com.example.cpen321_wedo.adapter;

import java.util.List;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.CheckBox;
import android.widget.TextView;
import com.example.cpen321_wedo.R;
import com.example.cpen321_wedo.GetSelected;
import com.example.cpen321_wedo.models.Task;

import org.json.JSONException;

public class GenerateTaskAdapter extends BaseAdapter {

    private List<Task> mData;
    private LayoutInflater mInflater;
    public GetSelected getSelectedInterface;

    public GenerateTaskAdapter(List<Task> list, LayoutInflater inflater, GetSelected getSelectedInterface) {
        mData = list;
        mInflater = inflater;
        this.getSelectedInterface = getSelectedInterface;
    }

    @Override
    public int getCount() {
        return mData.size();
    }

    @Override
    public Object getItem(int position) {
        return mData.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        final ViewItem item;
        View convertView_View = convertView;

        if (convertView_View == null) {
            convertView_View = mInflater.inflate(R.layout.generate_route_task_item,
                    null);
            item = new ViewItem();

            item.task_name = (TextView) convertView_View
                    .findViewById(R.id.task_name);

            item.task_address = (TextView) convertView_View.findViewById(R.id.task_address);

            item.task_checkbox = (CheckBox) convertView_View.findViewById(R.id.CheckBoxSelected);

            convertView_View.setTag(item);
        } else {
            item = (ViewItem) convertView_View.getTag();
        }

        Task curProduct = mData.get(position);

        item.task_name.setText(curProduct.getTaskName());
        item.task_address.setText(curProduct.getTaskLocation());

        item.task_checkbox.setChecked(false);

        item.task_checkbox.setOnClickListener(new View.OnClickListener(){

            @Override
            public void onClick(View v) {
                if(item.task_checkbox.isChecked()){
                    item.task_checkbox.setChecked(true);
                    Log.d("test", item.task_address.toString());
                    getSelectedInterface.onAdd(item.task_address.getText().toString());
                }else{
                    item.task_checkbox.setChecked(false);
                    try {
                        getSelectedInterface.onDelete(item.task_address.getText().toString());
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        });


        return convertView_View;
    }


    private class ViewItem {
        private TextView task_name;
        private TextView task_address;
        private CheckBox task_checkbox;
    }

}