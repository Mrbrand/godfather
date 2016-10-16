/* KNAPPAR   *******************************************************************/

$(".add-button").click(function() {
    itemList.add_from_form(current_page+" form");
     open_page(previous_page);
});


$(".back-button").click(function() { 
	if(view == "menu") set_categories();
     open_page("#issues");
});


$(".cancel-button").click(function() { 
    open_page(previous_page);
}); 

$("#category_filter").change(function() { 
    if($(this).val()=="edit") open_page("#category_list");
    else open_page("#issues");
}); 
 
 
$(".delete-button").click(function() {
	id = $(current_page+" form .item-id").val();
    if (confirm('Delete "'+itemList.get_item(id).title+'"?')==true) {
		itemList.remove_item(id);
		open_page(previous_page);
    }
});


$("#export-button").click(function() { 
    var items = itemList.get_all().query("finish_date", "==", "");
    var items_string = JSON.stringify(items);
    $("#export").html(items_string);
    $(".page").hide();
    $("#export").show();
});


$(".finish-button").click(function() {
        item = itemList.get_item($("#edit-item-form .item-id").val());
        itemList.edit_from_form("#edit-item-form");
        
        /*if(item.repeat){
            var item_copy = itemList.copy_item(item.id);
            item_copy["postpone"] = moment().add( item.repeat, 'days').format('YYYY-MM-DD');      
        }
        */
        
	    itemList.set_item_field(item.id, "finish_date", moment().format('YYYY-MM-DD HH:mm:ss'))
	            
        open_page(previous_page);
        //$("body").scrollTop(scroll_position);
        
 });
 
 
$("#import-button").click(function() { 
    if (confirm('All current_item data will be deleted?')==true) {
        window.localStorage.setItem(itemList.storageKey, $('#import').val());
       	open_page("#issues");
    }
});
 

$(".more-button").click(function() {	
	$('.more').show();
	$('.more-button').hide();
});
 
 
 
$(".new-issue-button").click(function() {
	$("#new-item-form").children().show();
	$("#new-item-form .context").hide();
	$("#new .menu-title").html("New Project");
	
	
	fill_form("#new-item-form", {title:"", type:"7",  icon:"", prio:"6", parent_id:"-"});	
	
	$('#new-item-form select[name="category"]').val($("#category_filter").val()); 
	if($("#category_filter").val() =="*") $('#new-item-form select[name="category"]').val("-"); 
	
	open_page ("#new");
});


$("#single_issue .new-task-button").click(function() { 
	$("#new-item-form").children().show();
	$("#new-item-form .category_select").hide();
	$("#new .menu-title").html("New Task for: "+current_item.title);
	
	fill_form("#new-item-form", {title:"", type:"6", parent_id: current_item.id,  icon:"", prio:"6", category: current_item.category});		
	
	open_page ("#new");
	
});

$("#task_list .new-task-button").click(function() { 
	$("#new-item-form").children().show();
	$("#new .menu-title").html("New Task: No project");
	
 	fill_form("#new-item-form", {title:"", type:"6", parent_id:"-", icon:"", prio:"6", category:"-"});		
	open_page ("#new");
	
});



$(".new-category-button").click(function() { 
    fill_form("#new-category-form", {title:"", type:"13", icon:""});	
	open_page ("#new-category");
	
});


$(".pref-button").click(function() { 
	open_page("#menu");
});

$("#task_list input[name='icon']").click(function() { 
	open_page("#task_list");
});


$(".save-button").click(function() {
    console.log(view);
    itemList.edit_from_form(current_page+" form");
     open_page(previous_page);
   
});

$("#show_postponed").change(function() { 
    open_page("#issues");
}); 


// swipe back
$("#single_issue").on('swiperight',  function(){ 
	open_page("#issues");
});


$(".task-list-button").click(function() { 
	open_page("#task_list");
});


$(".issue-list-button").click(function() { 
	open_page("#issues");
});



// GOTO EDIT  
$(document).on('click', ".task .subitem-left, .issue .subitem-left", function() {
	id = $(this).parent().find(".item_id").text();
	item = itemList.get_item(id);
	
	$("#edit .menu-title").html("Edit: "+item.title);
    fill_form("#edit-item-form", item);
    open_page ("#edit");
});


// GOTO CATEGORY EDIT  
$(document).on('click', ".category .subitem-left", function() {
	id = $(this).parent().find(".item_id").text();
	item = itemList.get_item(id);

	$("#edit-category .menu-title").html("Edit: "+item.title);
    fill_form("#edit-category-form", item);
    open_page ("#edit-category");
});

// GOTO SINGLE ISSUE
$(document).on('click', ".issue .subitem-center", function() {
	id = $(this).parent().find(".item_id").text();
	current_item = itemList.get_item(id);

	$("#single_issue .menu-title").text(current_item.title);

	open_page("#single_issue");
	//view_single_issue(id);
});


// GOTO SINGLE ISSUE
$(document).on('click', "#task_list .subitem-center", function() {
	id = $(this).parent().find(".item_id").text();
	current_item = itemList.get_item(itemList.get_item(id).parent_id);

	$("#single_issue .menu-title").text(current_item.title);
	
	open_page("#single_issue");
	//view_single_issue(id);
});


