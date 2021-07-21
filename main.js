
 
var customAudio =function(container)  {

	var audio_obj = false ;
	var audioContainer =  false;
	var tracksize = false ;
	var currentinterval = false;
	var waveInterva = false ;
	var loadedplay = false;
	var wavejs = false;
	var root = this;
	
	this.init = function(container){
		root.audioContainer = container;
		root.audio_obj = root.audioContainer.find('audio');
		// // console.log(root.audio_obj );
	 	root.audioContainer.find('.play-pause-btn').click(root.playPauseHandler);
	 	root.audio_obj.on('canplay',root.afterLoaded);
	 	root.audioContainer.find('.waves').click(root.changeTracktime);
	 	  
	 	 
	};
	this.changeTracktime = function(e)
	{
		e.preventDefault();
		 
	   var parentOffset = $(this).offset(); 
	   //or $(this).offset(); if you really just want the current element's offset
	   var relX = e.pageX - parentOffset.left;
	   // // console.log(relX);
	   
	   /* var relY = e.pageY - parentOffset.top;
	   // console.log(relY);*/

	   var total_width = jQuery(this).outerWidth();
	   var percentage = (relX*100)/total_width;

	   var get_clicked_time = (percentage * root.tracksize)/100;
	   root.setAudioat(get_clicked_time);
		  
	}
	this.setAudioat = function(seconds)
	{
		root.audio_obj[0].currentTime = seconds;
		root.audioTracktime();
	};

	this.afterLoaded = function(e)
	{
		// console.log(root.audio_obj.find('source').attr('src'));
		root.loadedplay = true;
		root.tracksize = root.audio_obj[0].duration;
		 
 
		/*root.wavejs = WaveSurfer.create({
		    container: '#'+root.audioContainer.find('.wave').attr('id'),
		    scrollParent: true
		});
		root.wavejs.load(root.audio_obj.find('source').attr('src'));*/

	};
	this.playPauseHandler = function(e)
	{
		e.preventDefault();
	 	// console.log(root);
		root.playPause();
	};

	this.playPause = function()
	{
		
		/*if(!root.loadedplay)
			return '';*/

		if(root.audio_obj[0].paused)
		{
			if(jQuery('.audio-player-container.playing').length > 0)
			{
				jQuery('.audio-player-container.playing').data('audio').pause();
			}
			root.play();

		// customAudio.currentinterval = setInterval(customAudio.intervalFunction, 200);
		}
		else
		{
			root.pause();
		}
	};
	this.play = function()
	{
		/*if(!root.loadedplay)
			return '';*/

		root.audio_obj[0].play();
		root.audio_obj.closest('.audio-player-container').addClass('playing');
		root.audio_obj.closest('.audio-player-container').removeClass('paused');
		root.audio_obj.closest('article').addClass('audio-playing');
		root.audio_obj.closest('article').removeClass('audio-paused');
		root.currentinterval = setInterval(root.intervalFunction, 50);
	}
	this.pause = function()
	{
		/*if(!root.loadedplay)
			return '';*/

		root.audio_obj[0].pause();
		clearInterval(root.currentinterval);
		root.audio_obj.closest('.audio-player-container').removeClass('playing');
		root.audio_obj.closest('.audio-player-container').addClass('paused');
		root.audio_obj.closest('article').removeClass('audio-playing');
		root.audio_obj.closest('article').addClass('audio-paused');
	}
	this.intervalFunction = function()
	{
		root.audioTracktime();
	};

	this.audioTracktime = function()
	{
		if(root.tracksize==false)
			return '';

		var currentSec = root.audio_obj[0].currentTime;
		var remainingSec = root.tracksize - currentSec;
		/*// console.log(remainingSec);
		// console.log(customAudio.audio_obj[0].currentTime);
		// console.log(customAudio.tracksize);*/
		root.audioContainer.find('.timer').text(root.formatedTime(currentSec));

		var get_percentage = (currentSec*100)/root.tracksize;
		root.audioContainer.find('.waves .wave-filled').width(get_percentage+'%');
	};
	 
	this.formatedTime = function(time)
	{
		var minutes = Math.floor(time / 60);
		var seconds = parseInt(time - minutes * 60);
		return minutes+':'+('0' + seconds).slice(-2);
	}

	this.init(container);
}; 
 

jQuery(document).ready(function(){

	if(jQuery('a[href^="#"]').length > 0 )
	{
		jQuery('a[href^="#"]:not(.not-smooth)').click(function(e){
			e.preventDefault();

			$('html, body').animate(
		    {
		      scrollTop: $($(this).attr('href')).offset().top,
		    },
		    500,
		    'linear'
		  )
		});
	}
	if(jQuery('.audio-player-container').length > 0 )
	{
		jQuery('.audio-player-container').each(function(){
			 
			jQuery(this).data('audio',new customAudio(jQuery(this)));
		})
		 
	}

	
	init_dropdown_open();
	if(jQuery('.trigger-load-more').length > 0)
	{
		var page_number = jQuery('#page_number').val();
		jQuery('.trigger-load-more').click(function(e){
			e.preventDefault();
			jQuery.ajax({
				url:script_data.ajax_url,
				data : jQuery('#load-post-form').serialize(),
				beforeSend:function(xhr)
				{
					jQuery('#load-post-form .loader-outer').show();
					jQuery('.trigger-load-more').hide();
				},
				complete:function()
				{
					jQuery('#load-post-form .loader-outer').hide();
					jQuery('.trigger-load-more').show();
				},
				success:function(data)
				{
					// console.log(data);
					if(data !='')
					{
						jQuery('.ajax-loading-post-container').append(data);
						jQuery('.ajax-loading-post-container .paged-section:last-child .audio-player-container').each(function(){
							jQuery(this).data('audio',new customAudio(jQuery(this)));
						});
						jQuery('#page_number').val(parseInt(jQuery('#page_number').val())+1);
						read_more_button_hide_show();
						init_dropdown_open();

					}
					else
					{
						jQuery('.load-more-post-handle').remove();
					}
				}

			})
		});
		read_more_button_hide_show();
	}
	if(jQuery('.custom-humberg-menu').length > 0)
	{
		jQuery('.custom-humberg-menu').click(function(e){
			e.preventDefault();
			/*if(jQuery('.sidebar').hasClass('opened'))
			{
				jQuery('.sidebar').removeClass('opened');
				jQuery('body').removeClass('menu-opened');
			}
			else
			{
				jQuery('.sidebar').addClass('opened');
				jQuery('body').addClass('menu-opened');
			}*/
			if(jQuery('body').hasClass('menu-opened'))
			{
				 
				jQuery('body').removeClass('menu-opened');
			}
			else
			{
				 
				jQuery('body').addClass('menu-opened');
			}
		});
	}

	if(jQuery('.mc-embedded-subscribe-form').length > 0)
	{
		jQuery('.mc-embedded-subscribe-form').submit(function(e){
			e.preventDefault();
			var $form = jQuery(this);
			var email = $form.find('.mce-EMAIL').val();
			// console.log(email);
			if(email == '')
			{
				alert('Please enter email');
				return '';
			}
			// console.log(ValidateEmail(email));
			if(!ValidateEmail(email))
			{
				alert('Please enter valid email');
				return '';
			}

			$.ajax({
		        type: $form.attr('method'),
		        url: $form.attr('action'),
		        data: $form.serialize(),
		        cache       : false,
		        dataType    : 'json',
		        contentType : "application/json; charset=utf-8",
		        error       : function(err) { alert("Could not connect to the registration server. Please try again later."); },
		        success     : function(data) {
		        	if(data.msg.indexOf('is already subscribed')!=-1)
		        	{
		        		jQuery('#subscribemodal').find('.modal-body p').html(email+' is already subscribed.');
		        	}
		        	else if(data.msg.indexOf('Thank you for')!=-1)
		        	{
		        		jQuery('#subscribemodal').find('.modal-body p').html('Thank you for subscribing.');
		        	}
		        	else
		        	{
		        		jQuery('#subscribemodal').find('.modal-body p').html(data.msg);
		        	}
		        	
		        	jQuery('#subscribemodal').modal('show');

		            if (data.result != "success") {
		            	

		            } else {
		                // It worked, carry on...
		                $form.find('.mce-EMAIL').val('');
		                jQuery('.cancel-sub-link').click();

		            }
		        }
		    });
		})
	}

	if(jQuery('.content-with-more .content-more-link').length > 0)
	{
		jQuery('.content-with-more .content-more-link').click(function(e){
			e.preventDefault();
			if(!jQuery(this).closest('.content-with-more').hasClass('full'))
			{
				 
				jQuery(this).closest('.content-with-more').addClass('full');
			}
			else{
				 
				 

				jQuery(this).closest('.content-with-more').removeClass('full');
			}

		});
		/*jQuery('.content-with-more').each(function(){
			var possible_height = 0 ;
			jQuery(this).find('p').each(function(i,v){
				if(i < 5)
				 possible_height += jQuery(this).height();
			});
			jQuery(this).height(possible_height+'px');
		});*/ 

	}
	if(jQuery('.subscribe-open').length > 0 && jQuery(window).width() > 768) 
	{
		jQuery('.subscribe-open a,.subscribe-open').click(function(e){
			e.preventDefault();
			jQuery(this).closest('.site-header').addClass('subscribe-opened');
			jQuery(this).closest('.site-header').find('.email').focus();
		});

	}
	if(jQuery('.subscribe-popup-link').length > 0)
	{
		jQuery('.subscribe-popup-link').click(function(e){
			e.preventDefault();
			jQuery(this).closest('.post-subscribe-box').addClass('open');
		});
	}
	if(jQuery('.post-subscribe-box .cancel-sub-link').length > 0)
	{
		jQuery('.post-subscribe-box .cancel-sub-link').click(function(e){
			e.preventDefault();
			jQuery(this).closest('.post-subscribe-box').removeClass('open');
		});
	}
	if(jQuery('.site-header .cancel-sub-link').length > 0) 
	{
		jQuery('.site-header .cancel-sub-link').click(function(e){
			e.preventDefault();
			 
			jQuery(this).closest('.site-header').removeClass('subscribe-opened');
		});

	}

	if(jQuery('#searchform .reset-btn').length > 0)
	{
		jQuery('#searchform .reset-btn').click(function(e){
			e.preventDefault();
			jQuery(this).closest('form').find('input').val('');
		});
	}	

	jQuery(document).on('mouseenter','#jp-relatedposts a.jp-relatedposts-post-a',function(){ jQuery(this).attr({'title':''});});	
	jQuery('body').click(function(e){
		var target = $(e.target);
		if (!target.is('.more-link-dropdownopner') && !target.is('.more-link-dropdownopner .fas')
		&& !target.is('.available-podcast-container .podcast-page-link .podcast-more-dropdown a')
		) {
			jQuery('.podcast-more-container').removeClass('open');
		}
		
	});
	jQuery('.more-link-dropdownopner').click(function(e){
		e.preventDefault();
		if(jQuery(this).closest('.podcast-more-container').hasClass('open'))
			jQuery(this).closest('.podcast-more-container').removeClass('open');
		else
			jQuery(this).closest('.podcast-more-container').addClass('open');
	});
	

});
function ValidateEmail(mail) 
{
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(mail))
  {
    return (true)
  }
    
    return (false)
}
function get_format_minutes(time)
{
	
}

function refresh_audio_tracktime()
{

}

function read_more_button_hide_show()
{
	// console.log(script_data.post_per_page);
	// console.log(jQuery('.ajax-loading-post-container .paged-section:last-child .blog-item').length);
	if(jQuery('.ajax-loading-post-container .paged-section:last-child .blog-item').length < script_data.post_per_page)
	{
		jQuery('.load-more-post-handle').remove();
	} 
}

function init_dropdown_open()
{
	$('.dropdown').on('show.bs.dropdown', function () { 
	   jQuery(this).closest('.blog-item').addClass('dropdown-opened');
	});
	$('.dropdown').on('hidden.bs.dropdown', function () { 
	   jQuery(this).closest('.blog-item').removeClass('dropdown-opened');
	});
}


