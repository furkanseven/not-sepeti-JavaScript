const yeniGorev=document.querySelector('.input-gorev'); //Textbox'ı seçtik.
const yeniGorevEkleBtn=document.querySelector('.btn-gorev-ekle');//Görev ekle butonu.
const gorevListesi=document.querySelector('.gorev-listesi');//Görevlerimiz ekleyeceğimiz liste.(ul yapısı)

yeniGorevEkleBtn.addEventListener('click',gorevEkle);//Görev ekle butonuna tıklandığında.
gorevListesi.addEventListener('click',gorevSilTamamla);//Görev listesi seçmemizin sebebi;iki butonunda parenti olduğu için,
//bu parenti seçtikten sonra artık hangi butonun tıklanıldığına karar vermek için fonksiyon içinde karar vereceğiz.

document.addEventListener('DOMContentLoaded',localStoregeOku);//Bütün dökümana evet listener verdik,varolan tüm DOM yağısı yüklendikten sonra bunu çağır dedik.


function gorevEkle(e){
    e.preventDefault();

    if(yeniGorev.value.length>1){
        gorevItemOlustur(yeniGorev.value);
        //Local storege'a kaydet
        localStorageKaydet(yeniGorev.value);
        yeniGorev.value="";   
    }
   else{
    alert('Yeni görev tanımı boş, tanım giriniz.');
   }
}

function gorevSilTamamla(e){
    //console.log(e.target); bu yapı ile nereye tıkladığımızı göreiliriz.

    const tiklanilanEleman = e.target;
    console.log(tiklanilanEleman);
    //contains içeriyorsa demek yani tıklanılan elemanın 'gorev-btn-tamamlandi' sınıfı içeriyorsa dedik.
    //yani turuncu buton tıklandı ise dedik.
    //fakat içinde icon olduğu için ona tıklandığında çalışmayacak onun tıklanma eventini css'den pasif yapmalıyız
    //ilgili icon sınıfı seçilip pointer-events: none;
    if(tiklanilanEleman.classList.contains('gorev-btn-tamamlandi')){
        //turuncu buton tıklandıysa,bunun parentina git ve sınıf listesine toggle ile ekle,eğer var ise sil,yoksa ekle.
        tiklanilanEleman.parentElement.classList.toggle('gorev-tamamlandi');
    } 

    //kırmızı buton tıklandıysa
    if(tiklanilanEleman.classList.contains('gorev-btn-sil')){

        if(confirm('Silinecek emin misiniz?')){
        //parent elemanına yani div'e toggle ile gorevSilKaybolma bu sayaede efektli şekilde silinecek.
        tiklanilanEleman.parentElement.classList.toggle('gorevSilKaybolma');

        //burda sil butonuna bastık onun parentine gidiyoruz parenti'bir div ve vu div içindeki veriyi silmek istediğiizden bu da li olmuş oluyor,
        //yani parentinin ilk çocuğu 0.index'in içindeki değeri yani innerTexti
        const localdenSilinecekGorev=tiklanilanEleman.parentElement.children[0].innerText;
        localStorageSil(localdenSilinecekGorev);

        //Verdiğimiz efek end olunca sonlanınca bu fonksiyon çalışacak
        tiklanilanEleman.parentElement.addEventListener('transitionend',function(){

        //parenti yani komple o ilgili div'i silmiş olduk o satır yani(hem li text var hemde içindeki butonlar yani div'i sildik tüm satırı)
            tiklanilanEleman.parentElement.remove();
        })
        }
    }
}

function localStorageKaydet(yeniGorev){
    //bu fonk içinde kullanılmak üzere bir değişken oluşturulmuş, bu değişkene fonk. atadık.
    let gorevler=localStorageArrayDonustur();
    

    gorevler.push(yeniGorev);
    localStorage.setItem('gorevler',JSON.stringify(gorevler));//local storege yazmak için stringfy ile görevler dizisinin yeni halini storagemıza ekledik.
}

function localStoregeOku(){
    let gorevler=localStorageArrayDonustur();
   

    gorevler.forEach(function(gorev){//Burada her bir görevi gezerken tüm yapıyı oluştur.
        gorevItemOlustur(gorev);
    });
}

//Bu yapıyı forEach içerisinde görev item yapısını oluşturuken tüm görev ekle kodunu copy-paste yapmamak için oraya sadece fonk.yazmak için yaptık
function gorevItemOlustur(gorev){
    //div oluşturma
    const gorevDiv=document.createElement('div');//div oluşturduk
    gorevDiv.classList.add('gorev-item');//kaç tanae sınıf varsa ona göre bu kod ile o sınıfların tümünü eklemeliyiz.

    //li oluşturma
    const gorevLi=document.createElement('li');//li oluşturduk.
    gorevLi.classList.add('gorev-tanim');

    gorevLi.innerText=gorev;//li içine yazılacak yazıyı, textboxtan(gorev ekleden gelen parametre) gelen değeri aktarıyoruz.
    gorevDiv.appendChild(gorevLi);//li'yi div'in içine ekledik.

    //ul'ye oluşturduğumuz div'i ekleyelim.
    gorevListesi.appendChild(gorevDiv);

    //tamamlandı butonu oluştur ve ekle.
    const gorevTamamBtn = document.createElement('button');
    gorevTamamBtn.classList.add('gorev-btn');
    gorevTamamBtn.classList.add('gorev-btn-tamamlandi');
    gorevTamamBtn.innerHTML='<i class="fa-regular fa-square-check"></i>';
    gorevDiv.appendChild(gorevTamamBtn);

    //sil butonu oluştur ve ekle
    const gorevSilBtn=document.createElement('button');
    gorevSilBtn.classList.add('gorev-btn');
    gorevSilBtn.classList.add('gorev-btn-sil');
    gorevSilBtn.innerHTML='<i class="fa-regular fa-trash-can"></i>';
    gorevDiv.appendChild(gorevSilBtn);
    
    
}

function localStorageSil(gorev){
  
    let gorevler=localStorageArrayDonustur();
    //splice ile item silme.  (delete veya filterlada silinebilir)
    //buraya görev adında yollanan parametrenin dizimizdeki indexini bulmamız gerekli
    const silinecekElemanIndex=gorevler.indexOf(gorev);//indexof ile hangi indexte olduğunu bulduk.
    gorevler.splice(silinecekElemanIndex,1);//hangi elemanı sileceksin,  kaç tane sieceksin.


    //Yeni oluşmuş siliniş güncel diziyi tekrar localstorega geri yazdık
    localStorage.setItem('gorevler',JSON.stringify(gorevler));
}

function localStorageArrayDonustur(){
    let gorevler;
    if(localStorage.getItem('gorevler')===null){ //localstorege'da gorevler yoksa gorevler dizisi oluştur.
        gorevler=[];
    }
    else{
        gorevler=JSON.parse(localStorage.getItem('gorevler'));//Varsa bunu JSON.parse formatında ve gorevler dizisine dönüştür ve aktar
    }
    return gorevler;
}

