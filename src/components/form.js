import {  React,useEffect, useState,useRef } from "react";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import {  storage } from "../firebase-config";
import { db } from "../firebase-config";
// import "../App.css";
import {collection,getDocs,addDoc,doc, updateDoc} from "firebase/firestore";
import { useForm } from "react-hook-form";
import {MultiSelect} from "react-multi-select-component";
import image from '../images/Logo1.png';
import image1 from '../images/Logo2.png';
import HCaptcha from "@hcaptcha/react-hcaptcha";


const optionsIndustries = [
  { label: "Administracja", value: "Administracja"},
  { label: "Analiza danych", value: "Analiza danych"},
  { label: "Architektura", value: "Architektura"},
  { label: "Automatyka", value: "Automatyka"},
  { label: "Backend Developer", value: "Backend Developer"},
  { label: "Biotechonologia", value: "Biotechnologia"},
  { label: "Budownictwo", value: "Budownictwo"},
  { label: "Cyberbezpieczeństwo", value: "Cyberbezpieczeństwo"},
  { label: "Chemia Przemysłowa", value: "Chemia Przemysłowa"},
  { label: "Chemia w Kryminalistyce", value: "Chemia w Kryminalistyce"},
  { label: "Data Science", value: "Data Science"},
  { label: "E-commerce", value: "E-commerce"},
  { label: "Edukacja", value: "Edukacja"},
  { label: "Elektryka", value: "Elektryka"},
  { label: "Ekologiczne źródła energii", value: "Ekologiczne źródła energii"},
  { label: "Ekonomia", value: "Ekonomia"},
  { label: "Energetyka", value: "Energetyka"},
  { label: "Event Management", value: "Event Management"},
  { label: "Farmacja", value: "Farmacja"},
  { label: "Finanse i rachunkowość", value: "Finanse i rachunkowość"},
  { label: "Frontend Developer", value: "Frontend Developer"},
  { label: "Full-stack Developer", value: "Full-stack Developer"},
  { label: "Geodezja i kartografia", value: "Geodezja i kartografia"},
  { label: "Geoinformatyka", value: "Geoinformatyka"},
  { label: "Górinictwo", value: "Górnictwo"},
  { label: "Grafika", value: "Grafika"},
  { label: "Hardware Developer", value: "Hardware Developer"},
  { label: "Helpdesk w IT", value: "Helpdesk w IT"},
  { label: "Human Resources", value: "Human Resources"},
  { label: "Hutnictwo", value: "Hutnictwo"},
  { label: "Inyniera Biomedyczna", value: "Inżynieria Biomedyczna"},
  { label: "Inżynieria materiałowa", value: "Inżynieria materiałowa"},
  { label: "Inżyniera naftowa i gazownicza", value: "Inżyniera naftowa i gazownicza"},
  { label: "Komputerowe Wspomaganie Procesów Inynierskich", value: "Komputerowe Wspomaganie Procesów Inynierskich"},
  { label: "Kryminalistyka", value: "Kryminalistyka"},
  { label: "Księgowość", value: "Księgowość"},
  { label: "Logistyka", value: "Logistyka"},
  { label: "Marketing i media", value: "Marketing i media"},
  { label: "Matematyka Stosowana", value: "Matematyka Stosowana"},
  { label: "Materiałoznactwo", value: "Materiałoznactwo"},
  { label: "Mechatronika", value: "Mechatronika"},
  { label: "Metalurgia", value: "Metalurgia"},
  { label: "Medycyna", value: "Medycyna"},
  { label: "Mikro- i Nano-technologie ", value: "Full-stack Developer"},
  { label: "Mikroelektronika", value: "Mikroelektornika"},
  { label: "Mobile Developer", value: "Mobile Developer"},
  { label: "Motoryzacja", value: "Motoryzacja"},
  { label: "Ochrona środowiska", value: "Ochrona środowiska"},
  { label: "Ochrona własności intelektualnej", value: "Ochrona własności intelektualnej"},
  { label: "Odnawialne źródła energii", value: "Odnawialne źródła energii"},
  { label: "Optyka", value: "Optyka"},
  { label: "Product Management", value: "Product Management"},
  { label: "Produkcja przemysłowa", value: "Produkcja przemysłowa"},
  { label: "Project Management", value: "Project Management"},
  { label: "Projektowanie stron internetowych", value: "Projektowanie stron internetowych"},
  { label: "Public Realtions", value: "Public Relations"},
  { label: "QA Engineer", value: "QA Engineer"},
  { label: "Rekrutacja", value: "Rekrutacja"},
  { label: "Rewiatalizacja terenów zdegradowanych", value: "Rewiatalizacja terenów zdegredowanych"},
  { label: "Robotyka", value: "Robotyka"},
  { label: "Software engineering", value: "Software engineering"},
  { label: "Spedycja", value: "Spedycja"},
  { label: "Sprzedaż", value: "Sprzedaż"},
  { label: "Socjologia", value: "Socjologia"},
  { label: "Technologia Chemiczna", value: "Technologia Chemiczna"},
  { label: "Telekomunikacja", value: "Telekomunikacja"},
  { label: "Tester Oprogramowania", value: "Tester Oprogramowania"},
  { label: "Transport", value: "Transport"},
  { label: "UX/UI", value: "UX/UI"},
  { label: "Zarządzanie procesami przemysłowami", value: "Zarządzanie procesami przemysłowami"},
]


function Form(){
 

  //react hooki
  const [users, setUsers] = useState([]);
  //multiselecty
  const [industries, setIndustries] = useState([]);

  const[verify,setVerify] = useState(false);
  //link do pliku
  const [cvUrl, setCvUrl] = useState([]);
  const[flag,setFlag] = useState("")
  //formularz
  const { register, handleSubmit, reset, formState: { errors }} = useForm({shouldUnregister: false})
  //Captcha
  const captchaRef = useRef(null);

  const usersCollectionRef = collection(db, "users");
   

  
  
  //nawiązanie kontaktu z bazą
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ 
        ...doc.data(), id: doc.id 
      })));
    }; 
    getUsers();
  }, 
  []);
 
  
  useEffect(() => {
    const editUser = async () =>{
      const docCollectionRef = doc(db,"users",flag)
      await updateDoc(docCollectionRef,{
        cvUrl: cvUrl
      });
      console.log(cvUrl);
    };
    editUser();
  },
  [cvUrl]);
  
  
  //funckja tworzaca uzytkownika w baze danych z danymi zebranymi z formularza

  const onLoad = () => {
    // this reaches out to the hCaptcha JS API and runs the
    // execute function on it. you can use other functions as
    // documented here:
    // https://docs.hcaptcha.com/configuration#jsapi
    captchaRef.current.execute();
  };
  
  const createUser = async (data) => {
    
    //dodajemy do dokumentu dane zebrane z formularza
    const docRef = await addDoc(usersCollectionRef, { 
      firstName: data.firstName,
      lastName: data.lastName, 
      email: data.email, 
      yearOfBirth: data.yearOfBirth,
      sex: data.sex,
      phone: data.phone,
      degree: data.degree,
      university: data.university, 
      yearOfStudy: data.yearOfStudy,
      polishLanguageLevel: data.polishLanguageLevel,
      englishLanguageLevel: data.englishLanguageLevel,
      otherLanguage: data.otherLanguage,
      otherLanguageLevel: data.otherLanguageLevel,
      githubLink: data.githubUrl,
      linkedinLink: data.linkedInUrl,
      industries: industries,
      cvUrl: cvUrl,
      isInCracow: data.isInCracow
    });
    setFlag(docRef.id)
  };

  //funkcja wgrywająca submitująca wysłany formularz
  const submitForm = (data) => {
    if(data.file[0].size>5242880){
      alert("Rozmiar pliku przekracza 5MB, wprowadź plik o dopuszczalnym rozmiarze!")
    }
    else if(verify ){
        alert("Formularz wysłany poprawnie!")
        uploadFiles(data.file[0])
        createUser(data)
        reset()
        
        }
    else{
          alert("Prosimy o potwierdzenie swojego człowieczeństwa!")
        }
  };
 
  const uploadFiles = async (file) => {

    if (!file) return;

    const storageRef = ref(storage, `${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    //ustawiamy link do pliku, który został wgrany 
    
    uploadTask.on(
      "state_changed",
      () => {},
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
           setCvUrl( downloadURL);
        });
      }
    );
    
  };
  
  

  


  return (
    <div className="App" contenteditable>
      <form onSubmit={handleSubmit(submitForm)}>
        


        <label id="label">Imię<span style={{color: "red"}}>*</span></label>

        <input{...register("firstName")}
            required = {true}
            type="text"
            id="input"
        />
        {errors.firstName && <span>Prosimy o podanie imienia.</span>} 

        <label id="label">Nazwisko<span style={{color: "red"}}>*</span></label>

        <input{...register("lastName")}
            required = {true}
            type="text"
            id="input"
        />
        {errors.lastName && <span>Prosimy o podanie nazwiska.</span>} 

        <label id="label"> Rok urodzenia<span style={{color: "red"}}>*</span></label>
        <select {...register("yearOfBirth")} required={true}>
            
          <option value=" "> </option>
          <option value="1980">1980</option>
          <option value="1981">1981</option>
          <option value="1982">1982</option>
          <option value="1983">1983</option>
          <option value="1984">1984</option>
          <option value="1985">1985</option>
          <option value="1986">1986</option>
          <option value="1987">1987</option>
          <option value="1988">1988</option>
          <option value="1989">1989</option>
          <option value="1990">1990</option>
          <option value="1991">1991</option>
          <option value="1992">1992</option>
          <option value="1993">1993</option>
          <option value="1994">1994</option>
          <option value="1995">1995</option>
          <option value="1996">1996</option>
          <option value="1997">1997</option>
          <option value="1998">1998</option>
          <option value="1999">1999</option>
          <option value="2000">2000</option>
          <option value="2001">2001</option>
          <option value="2002">2002</option>
          <option value="2003">2003</option>
          <option value="2004">2004</option>
        </select>

        <label id="label">Email<span style={{color: "red"}}>*</span></label>
        <input
        id="email"
        {...register("email", {
          required: "required",
          pattern: {
            value: /\S+@\S+\.\S+/,
           
          }
        })}
        type="email"
      />

        <label id="label">Numer telefonu<span style={{color: "red"}}>*</span></label>
        <input{...register("phone")}
            id="input"
            type="number"
            required = {true}
        />
        {errors.phone && <span>Prosimy o podanie numeru telefonu.</span>} 

        <label id="label"> Płeć<span style={{color: "red"}}>*</span></label>
        <select {...register("sex")} required={true }>

          <option value=" "> </option>
          <option value="Nie chcę podawać">Nie chcę podawać</option>
          <option value="Kobieta">Kobieta</option>
          <option value="Mężczyzna">Mężczyzna</option>
          <option value="inna">Inna</option>
                  
        </select>

        <label id="label">Mieszkam w Krakowie</label>
        <div id="inputWrapper">
        <input{...register("isInCracow")}
            id="input"
            type="checkbox"
        />
        </div>


        <label id="label">Uczelnia</label>

        <select {...register("university")}>

          <option value=""></option>
          <option value="Akademia Górniczo-Hutnicza">Akademia Górniczo-Hutnicza</option>
          <option value="Akademia Ignatium">Akademia Ignatium</option>
          <option value="Akadem ia Morska w Szczecinie">Akademia Morska w Szczecinie</option>

          <option value="Akademia Sztuk Pięknych w Krakowie">Akademia Sztuk Pięknych w Krakowie</option>
          <option value="Akademia Wychowania Fizycznego w Krakowie">Akademia Wychowania Fizycznego w Krakowie</option>
          <option value ="Krakowska Akademia im. Andrzeja Frycza Modrzewskiego"> Krakowska Akademia</option>
          <option value="Politechnika Białostocka">Politechnika Białostocka</option>
          <option value="Politechnika Częstochowska">Politechnika Częstochowska</option>
          <option value="Politechnika Gdańska">Politechnika Gdańska</option>
          <option value="Politechnika Koszalińska">Politechnika Wrocławska</option>
          <option value="Politechnika Krakowska">Politechnika Krakowska</option>
          <option value="Politechnika Lubelska">Politechnika Lubelska</option>
          <option value="Politechnika Łódzka">Politechnika Łódzka</option>
          <option value="Politechnika Opolska">Politechnika Opolska</option>
          <option value="Politechnika Poznańska">Politechnika Poznańska</option>
          <option value="Politechnika Białostocka">Politechnika Śląska</option>
          <option value="Politechnika Warszawska">Politechnika Warszawska</option>
          <option value="Politechnika Wrocławska">Politechnika Wrocławska</option>
          <option value="Wojskowa Akademia Techniczna">Wojskowa Akademia Techniczna</option>
          <option value="Uniwersytet Jagieloński">Uniwersytet Jagieloński</option>
          <option value="Uniwersytet Morski w Gdyni">Uniwersytet Morski w Gdyni</option>
          <option value="Uniwersytet Pedagogiczny">Uniwersytet Pedagogiczny</option>
          <option value="Uniwersytet Papieski Jana Pawła II">Uniwersytet Papieski Jana Pawła II</option>
          <option value="Uniwersytet Rolniczy">Uniwersytet Rolniczy</option>
          <option value="Zachodniopomorski Uniwersytet Techniczny">Zachodniopomorski Uniwersytet Techniczny</option>

          <option value="Inna">Inna</option>

        </select>

        {
        /*universityFlag =="Inna" &&(<input{...register("universityExtras")}
            placeholder="Uczelnia"
            onChange={()=>setUserData("universityExtras")}
         />)*/
         }

        <label id="label"> Kierunek Studiów <span id="span" style = {{fontSize: 14 }} >(pełna nazwa)  </span> </label>

        <input{...register("degree")}
        type="text"
        id="input"
        />
        




        
        <label id="label">Rok studiów  </label>
        <select {...register("yearOfStudy")}>

          <option value="I">I</option>
          <option value="II">II</option>
          <option value="III">III</option>
          <option value="IV">IV</option>
          <option value="V">V</option>
          <option value="absolwent studiów I stopnia">absolwent studiów I stopnia (aktualnie nie studiuję)</option>
          <option value="absolwent studiów II stopnia">absolwent studiów II stopnia (aktualnie nie studiuję)</option>
          <option value="doktorat">doktorant</option>

        </select>

        <label id="label"> Znajomość języka polskiego </label> 

        <select {...register("polishLanguageLevel")}>

          <option value ="Język ojczysty">Język ojczysty</option>
          <option value ="A1">A1</option>
          <option value ="A2">A2</option>
          <option value ="B1">B1</option>
          <option value ="B2">B2</option>
          <option value ="C1">C1</option>
          <option value ="C2">C2</option>

        </select>

        <label id="label"> Znajomość języka angielskiego </label> 

        <select {...register("englishLanguageLevel")}>

          <option value ="A1">A1</option>
          <option value ="A2">A2</option>
          <option value ="B1">B1</option>
          <option value ="B2">B2</option>
          <option value ="C1">C1</option>
          <option value ="C2">C2</option>

        </select>

        <label id="label">Inny język obcy</label>
        <input{...register("otherLanguage")}
        id="input"
        type="text"
        placeholder="np. niemiecki, francuski"
        />

        <label id="label"> Znajomość tego języka obcego</label> 

        <select {...register("otherLanguageLevel")}>

          <option value ="-">-</option>
          <option value ="A1">A1</option>
          <option value ="A2">A2</option>
          <option value ="B1">B1</option>
          <option value ="B2">B2</option>
          <option value ="C1">C1</option>
          <option value ="C2">C2</option>

        </select>

        <label id="label">Link do Githuba </label>
        <input{...register("githubUrl")}
          defaultValue=""
          type="text"
          id="input"
        />

        <label id="label">Link do LinkedIna </label>

        <input{...register("linkedInUrl")}
          defaultValue=""
          type="text"
          id="input"
        />

        <label id="label">Interesują mnie branże<span style={{color: "red"}}>*</span></label>
        <MultiSelect
          options={optionsIndustries}
          value={industries}
          onChange={setIndustries}
          required={true}
          overrideStrings={{
            "allItemsAreSelected": "Wybrano wszystkie branże.",
            "clearSearch": "Wyczyść wyszukiwanie.",
            "noOptions": "Brak opcji.",
            "search": "Wyszukaj",
            "selectAll": "Wybierz wszystkie",
            "selectSomeItems": "Wybierz..."
          }}
          labelledBy="Select"
        />
        

        <label id="label">Akceptacja <a
                        rel="noopener noreferrer"
                        target="_blank"
                        onClick={() => {
                            window.open("./Klauzula o danych osobowych.pdf");
                        }}
                    >
                        klauzuli
                    </a><span style={{color: "red"}}>*</span></label>

        <div id="inputWrapper">
        <input{...register("accept")}
            id="input"
            type="checkbox"
            required={true}
        />
        </div>

        <label id="label">CV<span style={{color: "red"}} >*</span> <span id ="span" style = {{fontSize: 14 }}>(w formacie pdf)</span></label>
        <div id="inputWrapper">
          <input {...register("file")} type="file" id="input" accept="application/pdf" required={true} />
        </div>

        <div className="hcaptcha">
          <HCaptcha 
            class="captcha"
            sitekey="1d3bef9f-52ee-4589-a493-4d73c76b08aa"
            //onLoad={onLoad}
            onVerify={setVerify}
            ref={captchaRef}
          />
        </div>
        <input type="submit" id="submit" value="Prześlij"/>
        
      </form>
        

    </div>
  );

    }
export default Form;

