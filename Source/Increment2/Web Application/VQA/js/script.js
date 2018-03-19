$(document).ready(function() {

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
            alert("Your question '" + username + "' would be answered soon!")
        }
    });

    //pred spark-api click
    $(document).on('click', '#spark-btn', function(e){
        alert("Spark-API would be implemented soon!");
    });

    //pred clarifai-api click
    $(document).on('click', '#clarifai-btn', function(e){
        alert("Clarifai-API would be implemented soon!");
    });

    //pred tf-api click
    $(document).on('click', '#tf-btn', function(e){
        alert("TensorFlow-API would be implemented soon!");
    });

});