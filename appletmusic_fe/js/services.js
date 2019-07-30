var bffServer = "https://bff.music.desamovil.cl";
var service = {
	getLists: function (_fun) {
	    $.ajax({
	    	type: "GET",
           	dataType: "json",
           	url: bffServer + '/listas/list.json',
           	success: function (listas) {
               _fun(listas.data);
           	}
       	});
	},
	setNewList: function (listItem, _fun) {
		$.ajax({
			type: "POST",
			dataType: "json",
			url: bffServer + '/listas/new',
			contentType: 'application/json',
			data: JSON.stringify(listItem),
			success: function (response) {
				_fun(response);
			}
       	});
	},
	updateList: function (list, _fun) {
		$.ajax({
	    	type: "POST",
			dataType: "json",
			url: bffServer + '/listas/' + list._id,
			contentType: 'application/json',
			data: JSON.stringify(list),
           	success: function (response) {
               _fun(response);
           	}
       	});
	}
};