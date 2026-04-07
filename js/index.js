let baseReqUrl = 'https://register.hnqzy.top/income-api/';

let inviteCode = getQueryVariable('inviteCode') || ''
let logo = getQueryVariable('logo') || ''
let __ch__ = getQueryVariable('ch') || ''
let urlQueryStr = getUrlAddStr();

function getUrlAddStr(){
    return '?inviteCode='+inviteCode+'&logo='+logo+'&ch='+__ch__
}

function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

let registerIng = false
function registerAccount(){
    let otp = $('#otp_input').val().trim();
    let account = $('#account_input').val().trim();
    let phone = $('#phone_input').val().trim();
    let password = $('#password_input').val().trim();
    let rePassword = $('#confirm_password_input').val().trim();

    if(!/^[\d]{10}$/.test(phone)){
        return 
    }
    if(otp== '' ){
        return 
    }

    if(!/^[a-zA-Z]{6,16}$/.test(account)){
        return $('#account_input_error').show()
    }else{
        $('#account_input_error').hide()
    }

    if(!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,16}$/.test(password)){
        return $('#password_input_error').show()
    }else{
        $('#password_input_error').hide()
    }

    if(password !== rePassword){
        return $('#confirm_password_input_error').show()
    }else{
        $('#confirm_password_input_error').hide()
    }

    if(registerIng){
        return
    }
    registerIng = true
    $.ajax({
        type: "POST",
        url: baseReqUrl+'Login/register',
        data: {
            phone,
            password,
            account,
            otp,
            inviteCode,
            logo,
            ch:__ch__
        },
        success: function(data){
            registerIng = false
            const downloadLink = data.dataList.downloadLink
            localStorage.setItem('bigWinnerApkDown',downloadLink)
            if(data.status === '200'){
                location.replace('./success.html'+urlQueryStr)
            }   else{
                alert(data.message)
            }
        },
        error:function(){
            registerIng = false
            alert('The system is busy, please try again later')
        }
     });
}


$('#register_btn_down').click(()=>{
    registerAccount();
})

$('#phone_input').on('input',(e)=>{
    let phone = $('#phone_input').val().trim();
    if(!/^[\d]{10}$/.test(phone)){
      return  $('#send_otp_btn').removeClass('active') 
    }
    $('#send_otp_btn').addClass('active') 
})

let iscounDown = false;
$('#send_otp_btn').click((e)=>{
    let phone = $('#phone_input').val().trim();
    if(!/^[\d]{10}$/.test(phone)){
        return 
    }
    if(iscounDown){
        return 
    }

    iscounDown = true
    intervalTime(60,()=>{
        iscounDown = false
    })

    $.ajax({
        type: "POST",
        url: baseReqUrl+'Login/getOtp',
        data: {
            phone:phone,
        },
     });

})

function intervalTime(count,cb){
    if(0 >= count){
        $('#send_otp_btn').text('Send')
        return cb()
    }
    count--;

    $('#send_otp_btn').text( count + 's' )

    setTimeout(()=>{
        intervalTime(count,cb);
    },1000)
}


$('body').ready(()=>{

    $.ajax({
        type: "POST",
        url: baseReqUrl+'Login/getDownloadLink',
        success:(data)=>{
            let downloadLink= localStorage.getItem('bigWinnerApkDown')

            if(data.status == '200'){
                downloadLink = data.dataList.downloadLink
            }

            $('#donwn_apk').click(()=>{
                location.href = downloadLink
            })
        }
     });


    $('#back_register').click(()=>{
        location.replace('./index.html'+urlQueryStr)
    })
})