$(document).ready(function() {

	const app = new Clarifai.App({
	apiKey: 'cc1fc2f2e0d44091ae261b61c092bc3b'
	});

    //adjust thumbnail image size for image prediction
    var predimgs = $("#pred_area").find("img.tbp");
    for(var i = 0; i < predimgs.length; i++) {
        var predimg = $(predimgs[i]);
        predimg.height(100);
        predimg.width(180);
    }

    //adjust thumbnail image size for vqa
    var imgs = $(".container").find("img.tb");
    for(var j = 0; j < imgs.length; j++) {
        var img = $(imgs[j]);
        img.height(100);
        img.width(140);
    }

    //adjust height of prediction preview
    var predprev = $(".pred-inner").find("img.img-preview");
    predprev.height(420);
    predprev.width(500);

    //adjust height of vqa preview
    var vqaprev = $(".vqa-inner").find("img.img-preview");
    vqaprev.height(420);
    vqaprev.width(500);

    //vqa upload image
    $("#image-id").change(function() {
        readURL(this);
    });

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('.img-preview').attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    //pred set selected image to preview
    $('[id^=pred-selector-]').click(function () {
        var source = $(this).context.children[0].src;
        setImageForPreview(source);

    });

    //vqa set selected image to preview
    $('[id^=vqa-selector-]').click(function () {
        var source = $(this).context.children[0].src;
        setImageForPreview(source);

    });

    function setImageForPreview(imgSrc){
        var imgPrev = $('.img-preview');
        imgPrev.attr('src', imgSrc);
    }

    //vqa question enter press
    $(document).on('keypress', '#vqaQuestion', function(e){
        //check if the enter(i.e return) key is pressed
        if (e.which === 13) {
            //get what the user enters
            username = $(this).val();

            if (username === "where is the dog?"){
                //document.getElementById("vqa_image"). = "COCO_val2014_000000000939.jpg";
                $("vqa_image").attr("src","images/COCO_val2014_000000000939.jpg");
            }
            //alert("Your question '" + username + "' would be answered soon!")
        }
    });
	
	function getBase64Image(img) {
		img.crossOrigin = "Anonymous";
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);
		var dataURL = canvas.toDataURL("image/jpg");
		return dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
    }

    //pred spark-api click
    $(document).on('click', '#spark-btn', function(e){
		
		$('#pred_result').hide();
		$('#processing').show();
		var pred_img_src = $('#pred_img').attr('src'); 	
		var tmp_img = document.createElement("img");
		tmp_img.src = pred_img_src; 
		var base64 = getBase64Image(tmp_img);
		
		$.ajax({
		type: "POST",
		url: "http://127.0.0.1:8080/get_custom",
		data: base64,
		success: function (result) {
			$('#processing').hide();
			$('#pred_result').text(result);
			$('#pred_result').show();
		}
		});
    });

	function getClarifaiName(res, n) {
		var val = JSON.stringify(res.outputs[0].data.concepts[n].name, null, 2);
		val = val.replace('"', '');
		val = val.replace('"', '');
		return val;
    }
	
	function getClarifaiValue(res, n) {
		var val = JSON.stringify(res.outputs[0].data.concepts[n].value, null, 2)
		return val;
    }


    function arrayContains(response, arrhaystack)
    {
        var count=0;
        var i=0;
        for(i=0; i<5; i++){
            console.log(i+":"+getClarifaiName(response, i));
            if (arrhaystack.indexOf( getClarifaiName(response, i)) > -1){
                count=count+1;
            }
        }
        return count;
    }

    function indexOfMax(arr) {
        if (arr.length === 0) {
            return -1;
        }

        var max = arr[0];
        var maxIndex = 0;

        for (var i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                maxIndex = i;
                max = arr[i];
            }
        }
        return maxIndex;
    }

    //pred clarifai-api click
    $(document).on('click', '#clarifai-btn', function(e){
		$('#processing').show();
		$('#pred_result').hide();
		var pred_img_src = $('#pred_img').attr('src'); 	
		var tmp_img = document.createElement("img");
		tmp_img.src = pred_img_src; 
		var base64img = getBase64Image(tmp_img);

		//to determine category
        var kitchen=['stove','room','oven','microwave'];
        var bedroom=['bed','furniture','bedroom','chair'];
        var livingroom=['sofa','room','livingroom','chair'];
        var bathroom=['bathroom','mirror','room','battub','toilet','basin'];

		// predict the contents of an image by passing in a url
		app.models.predict(Clarifai.GENERAL_MODEL, {base64: base64img}).then(
		function(response) {

            var k=arrayContains(response,kitchen);
            var b=arrayContains(response,bedroom);
            var l=arrayContains(response,livingroom);
            var w=arrayContains(response,bathroom);
            var arr1=[k,b,l,w];
            var ans=['kitchen','bedroom','livingroom','bathroom'];
            var i = indexOfMax(arr1);

            var pred = "Image predicted as : "+ans[i];

			// var pred = getClarifaiName(response, 0) + ": " + getClarifaiValue(response, 0) + ", "
			// 			+ getClarifaiName(response, 1) + ": " + getClarifaiValue(response, 1) + ", "
			// 			+ getClarifaiName(response, 2) + ": " + getClarifaiValue(response, 2);

			$('#processing').hide();
			$('#pred_result').text(pred);
			$('#pred_result').show();
		},
		function(err) {
			alert("Error:" + err);
		}
        );
    });

    //pred tf-api click
    $(document).on('click', '#tf-btn', function(e){
        $('#pred_result').hide();
        $('#processing').show();
        var pred_img_src = $('#pred_img').attr('src');
        var tmp_img = document.createElement("img");
        tmp_img.src = pred_img_src;
        var base64 = getBase64Image(tmp_img);

        $.ajax({
            type: "POST",
            url: "http://localhost:5000/api/predict",
            data: { imageBase64: base64 },
            success: function (result) {
				var res = "Image predicted as: " + result.results[0][0];
                $('#processing').hide();
                $('#pred_result').text(res);
                $('#pred_result').show();
            }
        });
    });

});