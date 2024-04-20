
import 'style/home.scss'
import { MyButton } from 'component/MyButton'

export const Home = () => {

  return (
    <div className="home-page">
      <div className='container'>
        Home Page
        <MyButton title="hi"/>
      </div>
    </div>
  );
}