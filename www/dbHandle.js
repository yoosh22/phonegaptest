 // 데이터베이스 생성 및 열기
 function openDB(){
    db = window.openDatabase('cafeDB', '1.0', '카페DB', 1024*1024); 
    console.log('1_DB 생성...'); 
 } 

 // 테이블 생성 트랜잭션 실행
 function createTable() {
    db.transaction(function(tr){
        var createSQL = 'create table if not exists cafe(id integer primary key autoincrement, name varchar(20) not null unique, type varchar(20), score integer, region varchar(20), phone varchar(20), address varchar(30), memo varchar(200), pic varchar(50))';       
       
       tr.executeSql(createSQL, [], function(){
          console.log('2_1_테이블생성_sql 실행 성공...');        
       }, function(){
          console.log('2_1_테이블생성_sql 실행 실패...');            
       });
    }, function(){
                console.log('2_2_테이블 생성 트랜잭션 실패...롤백은 자동');
    }, function(){
                console.log('2_2_테이블 생성 트랜잭션 성공...');
    });
 } 

 // 데이터 입력 트랜잭션 실행
 function insertCafe(){ 
    db.transaction(function(tr){
        var name = $('#cafeName1').val();
        var type = $('#cafeType1').val();
        var score = $('#cafeScore1').val();
        var region = $('#cafeRegion1').val();
        var phone = $('#cafePhone1').val();
        var address = $('#cafeAddress1').val();
        var memo = $('#cafeMemo1').val();
        var pic = $('#cafePic1').val();        
        var insertSQL = 'insert into cafe(name, type, score, region, phone, address, memo, pic) values(?,?,?,?,?,?,?,?)';      
        tr.executeSql(insertSQL, [name, type, score, region, phone, address, memo, pic], function(tr, rs){    
             console.log('3_ 맛집 등록...no: ' + rs.insertId);
             alert('맛집명 ' + $('#cafeName1').val() + ' 이(가) 입력되었습니다');               
             $('#cafeType1').val('미정').attr('selected', 'selected'); 
             $('#cafeType1').selectmenu('refresh'); 
             $('#cafeRegion1').val('미정').attr('selected', 'selected'); 
             $('#cafeRegion1').selectmenu('refresh');
             $('#cafeScore12').val('0').slider('refresh'); 
        	 form1.reset();             
        }, function(){
            alert('맛집명 ' + $('#cafeName1').val() + ' 이(가) 입력 실패하였습니다');           
         });
    });      
 }
  
 // 데이터 수정 트랜잭션 실행
 function updateCafe(){
    db.transaction(function(tr){
        var new_name = $('#sCafeName2').val();
        var new_type = $('#cafeType2').val();
        var new_score = $('#cafeScore2').val();
        var new_region = $('#cafeRegion2').val();
        var new_phone = $('#cafePhone2').val();
        var new_address = $('#cafeAddress2').val();
        var new_memo = $('#cafeMemo2').val();
        var new_pic = $('#cafePic2').val(); 
        var old_name = varCafeName;      
        var updateSQL = 'update cafe set name = ?, type = ?, score = ?, region = ?, phone = ?, address = ?, memo = ?, pic = ? where name = ?';          
        tr.executeSql(updateSQL, [new_name, new_type, new_score, new_region, new_phone, new_address, new_memo, new_pic, old_name], function(tr, rs){    
             console.log('5_맛집 수정.... ') ;
             alert('맛집명 ' + varCafeName + ' 이(가) 수정되었습니다');                      
             $('#cafeType2').val('미정').attr('selected', 'selected'); 
             $('#cafeType2').selectmenu('refresh'); 
             $('#cafeRegion2').val('미정').attr('selected', 'selected'); 
             $('#cafeRegion2').selectmenu('refresh');
             $('#cafeScore2').val('0').slider('refresh'); 
        	 form2.reset();           
        }, function(){
            alert('맛집명 ' + $('#cafeName1').val() + ' 이(가) 수정 실패하였습니다');                  	 
        });
    });       
 }
 
  // 데이터 삭제 트랜잭션 실행
 function deleteCafe(){
   db.transaction(function(tr){
	  var name = varCafeName;   
 	  var deleteSQL = 'delete from cafe where name = ?';      
	  tr.executeSql(deleteSQL, [name], function(tr, rs){    
	     console.log('6_맛집 삭제... ');   
	     alert('맛집명 ' + varCafeName + ' 이(가) 삭제되었습니다');   	     
             $('#cafeType2').val('미정').attr('selected', 'selected'); 
             $('#cafeType2').selectmenu('refresh'); 
             $('#cafeRegion2').val('미정').attr('selected', 'selected'); 
             $('#cafeRegion2').selectmenu('refresh');
             $('#cafeScore2').val('0').slider('refresh'); 
        	 form2.reset();        
      }, function(){
          alert('맛집명 ' + $('#cafeName1').val() + ' 이(가) 삭제 실패하였습니다');                   	 
	  });
   });         
 } 
 
 // 데이터 수정 위한 데이터 검색 트랜잭션 실행
 function selectCafeModify(name){
   db.transaction(function(tr){
     var selectSQL = 'select name, type, score, region, phone, address, memo, pic from cafe where name=?';        
     tr.executeSql(selectSQL, [name], function(tr, rs){
        $('#sCafeName2').val(rs.rows.item(0).name);         
        $('#cafeType2').val(rs.rows.item(0).type).attr('selected', 'selected');     
        $('#cafeType2').selectmenu('refresh');    
        $('#cafeRegion2').val(rs.rows.item(0).region).attr('selected', 'selected');     
        $('#cafeRegion2').selectmenu('refresh');
        $('#cafeScore2').val(rs.rows.item(0).score).slider('refresh');                   
        $('#cafePhone2').val(rs.rows.item(0).phone);             
        $('#cafeAddress2').val(rs.rows.item(0).address);  
        $('#cafeMemo2').val(rs.rows.item(0).memo);  
        varCafeName = rs.rows.item(0).name;   
     });
   });         
 }

 // 카페 목록 동적 구성을 위한 데이터 검색 트랜잭션 실행
function selectCafeList() {
  	db.transaction(function(tr){
		var i, count, tagList='';   
	    var	sType = $('#cafeType3').val();  	 
	    var	sRegion = $('#cafeRegion3').val();  
	    var selectSQL = 'select name, type, score, region, phone, address, memo, pic  from cafe where type like ? and region like ?'; 	     	
	  	tr.executeSql(selectSQL, [sType, sRegion], function(tr, rs){    
   			console.log(' 카페 조회... ' + rs.rows.length + '건.');  
   			recordSet = rs;
			count = rs.rows.length;
			if(count > 0) {
				tagList = '<li data-role="list-divider">맛집 목록' + '<span style="float:right">'+count+'건'+'</span></li>';				
			    for( i = 0; i < count; i += 1) {			
					tagList += '<li><a onclick="displayCafeInfo(' + i + ');">'
					tagList += '<img class="my_listview_img" src="' + rs.rows.item(i).pic + '">';              					
					tagList += '<span class="ui-li-count">평점 : ' + rs.rows.item(i).score + '</span>';
					tagList += '<h2>' + rs.rows.item(i).name + '</h2>';
					tagList += '<p>' + rs.rows.item(i).type + '</p>';
					tagList += '<p>' + rs.rows.item(i).address + '</p></a></li>';					
			    }	
			    $('#cafeListArea').html(tagList);
			    $('#cafeListArea').listview('refresh');
			} else {
			  	navigator.notification.alert('검색 결과 없음', null, '맛집 검색 실패');
			}
		});
	});
}


 