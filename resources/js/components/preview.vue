<template>
<div style="text-align:center">
    <div :style="'display:inline-flex;align-items:center;letter-spacing:0.5px;cursor:pointer;font-size:'+options.text_size+'px;background-color:'+options.bg_color+';color:'+options.text_color+';padding:'+options.paddingtop+'px '+options.paddingright+'px '+options.paddingbottom+'px '+options.paddingleft+'px; border:'+options.borderwidth+'px solid '+options.bordercolor+';border-radius:'+options.borderradius+'px'" id="wh_button_handle">
        <div id="addto_wl_text_wrapp_before">
            <i v-if="options.button_type=='text_icon' || options.button_type=='only_icon'" :class="getIconClass.before" :style="'color:'+options.text_color+';font-size:'+options.icon_size+'px;'"></i>
            <span v-if="options.button_type=='text_icon' || options.button_type=='only_text'">{{options.btn_label_before}}</span>
        </div>
        <div id="addto_wl_text_wrapp_after" style="display:none">
            <i v-if="options.button_type=='text_icon' || options.button_type=='only_icon'" :class="getIconClass.after" :style="'color:'+options.text_color+';font-size:'+options.icon_size+'px;'"></i>
            <span v-if="options.button_type=='text_icon' || options.button_type=='only_text'" >{{options.btn_label_after}}</span>
        </div>
    <span id="wp_count" :style="'color:'+options.text_color+';font-size:'+options.text_size+'px; margin-left: 2px'" v-show="options.display_social_count">(2)</span>
    </div>
</div>
</template>

<script>
export default {
    props:['options'],
    computed:{
        getIconClass(){
            switch (this.options.button_icon){
                case "like":
                    return {"before":"fa-regular fa-thumbs-up","after":"fa-solid fa-thumbs-up"}
                case "heart":
                    return {"before":"fa-regular fa-heart","after":"fa-solid fa-heart"}
                case "star":
                    return {"before":"fa-regular fa-star","after":"fa-solid fa-star"}
            }
        }
    }
}
</script>

<style>
    @import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css';
</style>
