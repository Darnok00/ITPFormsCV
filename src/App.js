import "./App2.css";
import Form from "./components/form";
import image from './images/Logo1.png';
import image2 from './images/Logo2.png';

function App() {


  return (
    <div className="App">
      <picture>
        <source srcset={image2} media="(max-width: 600px)" alt="Logo"/>
        <img src={image} alt="Logo"/>
      </picture>
      <Form />
    </div>
    
  );
}

export default App;