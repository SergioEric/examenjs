import React, { Component } from "react";
import "./App.css";
import firebase from "firebase/app";
import "firebase/firestore";
import "gestalt/dist/gestalt.css";
import { swalError, swalSuccess } from './util.sweetalert';
import { CSSTransition } from 'react-transition-group';import {
  Avatar,
  Box,
  Button,
  Card,
  Heading,
  Link,
  Text,
  TextField,
  Column,
  RadioButton,
  Label,
  Image,
  IconButton
} from "gestalt";
import logo from'./logo_examen@0.5x.png'


const Section = ({ children, title }) => (
  <Box padding={2}>
    <Box marginBottom={1}>
      <Heading size="xs" align="center">{title}</Heading>
    </Box>
    {children}
  </Box>
);
const ActionDepartemnt = (props)=>(
  <Box color="darkGray"  padding={4}>
    <Box marginBottom={4}>
      <Text color="white" align="center">
        Usa los siguientes botones para gestionar proyectos
      </Text>
    </Box>
    <Box display="flex" direction="row" marginLeft={-2} marginRight={-2}>
      <Box display="flex" direction="row" column={4} paddingX={2}>
        <Button color="blue" text="Añadir"  onClick={()=>props.handleClick("add")}  />
      </Box>
      <Box column={4} paddingX={2}>
        <Button color="transparent" text="Editar" onClick={()=>props.handleClick("edit")} />
      </Box>
      <Box column={4} paddingX={2}>
        <Button color="red" text="Eliminar" onClick={()=>props.handleClick("delete")} />
      </Box>
    </Box>
  </Box>
);

const Departament = props => (
  // `${props.item.name}**${props.item.key}`
  <Box alignItems="center" paddingX={2} paddingY={1} display="flex" direction="row">
    <RadioButton
      checked={props.depart_key === props.item.key}
      id={props.item.name}
      name="department"
      onChange={props.handleDepartChange(`${props.item.name}**${props.item.key}`)}
      value={`${props.item.name}**${props.item.key}`}
    />
    <Box flex="grow">
      <Label htmlFor="genderMale">
        <Box paddingX={2}>
          <Text>{props.item.name}</Text>
          {/* <Text>{props.item.key}</Text> */}
        </Box>
      </Label>
    </Box>
  </Box>
);
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name_depart:"",
      action_department:"",
      edit_field_depart:"",
      departments:[],
      back_depart:[],
      depart:'',
      key_depart:''
    };
    this.depart_ref = firebase.firestore().collection('deparments')
    // this.ref = ''
  }
  onDepartmentUpdate= snapShot=>{
    let departments=[]
    snapShot.forEach(doc=>{
      const {name} = doc.data();
        departments.push({
          key:doc.id,
          name
        })
        // console.log(doc.data().name)
      })
    this.setState({
      departments:departments,
      back_depart:departments
    })
  }
  componentDidMount=()=> {
    this.unsubscribe = this.depart_ref.onSnapshot(this.onDepartmentUpdate)
  }
  handleClickActionDepartemnt=(name)=>{
    if (name === "add") {
      this.setState({
        action_department: name,
        departments: []
      });
    } else {
      this.setState({
        action_department: name,
        departments: this.state.back_depart
      });
    }
  }
  handleChange=e=> {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  }
  closeActionDepart=()=>{
    console.log('**************')
    this.setState({
      action_department: '',
      departments: this.state.back_depart
    });
  }
  _add_depart=()=>{
    // let depart = this.db.collection('deparment');
    if(this.state.name_depart === "") return swalError("Campo de nombre vacio", 1500)
    this.depart_ref.add({
        name: this.state.name_depart
    }).then(()=>{
      swalSuccess('Departamento agregado', 1500)
      this.setState({
        name_depart:'',
        action_department:'',
        departments:this.state.back_depart,
        depart:undefined
      })
    })
    .catch(error=>{
      swalError(error.message,2000)
    })
  }
  _edit_depart=()=>{
    if(!this.state.departments.length === 0){
      this.setState({departments:this.state.back_depart,})
    }
    if(!this.state.depart) return swalError('Selecciona un departamento',1800);
    if(this.state.edit_field_depart ==='') return swalError('Campo nombre vacio',1800);
    this.depart_ref.doc(this.state.key_depart).set({
      name:this.state.edit_field_depart
    },{ merge: true })
    .then(()=>{
      swalSuccess("Departamento editado",1000)
      this.setState({
        edit_field_depart:'',
        depart:'',
        key_depart:''
      })
    })
    .catch(error=>{
      swalError(error.message,1800)
    })
  }
  _delete_depart=()=>{
    if(this.state.departments.length === 0){
      this.setState({departments:this.state.back_depart,})
    }
    if(!this.state.depart) return swalError('Selecciona un departamento',1800);
    this.depart_ref.doc(this.state.key_depart).delete()
    .then(()=>{
      swalSuccess("Departamento borrado",1500)
    })
    .catch(error=>{
      swalError(error.message,2000)
    })
  }
  handleDepartChange=(name)=>{
    let txt = name.event.target.value.split('**')
    console.log(txt)
    this.setState({
      depart:txt[0],
      key_depart: txt[1]
    })
  }
  render() {
    return (
      <div className="container flex col">
        <header className="header flex">
          <img src={logo} alt="logo" className="logo" />
          <h1>Gestion Personal</h1>
        </header>

        <Box display="flex" direction="row" paddingY={2}>
          <Column span={6}>
            <Box color="lightGray" padding={1}>
              <Box color="white" paddingY={2}>
                <Text align="center" bold>
                  Departamentos
                </Text>
                {this.state.departments.map(depart => (
                  <div key={depart.key}>
                    <Departament
                      item={depart}
                      depart_key={this.state.key_depart}
                      handleDepartChange={() => this.handleDepartChange}
                    />
                  </div>
                ))}
                {this.state.action_department === "add" ? (
                  <Section title="Añadir">
                    <div className="close_btn flex">
                      <IconButton
                        accessibilityLabel="close"
                        bgColor="white"
                        icon="clear"
                        iconColor="red"
                        onClick={() => {
                          this.closeActionDepart();
                        }}
                      />
                    </div>
                    <input
                      id="add_depart"
                      onChange={this.handleChange}
                      placeholder="Nombre del departamento"
                      value={this.state.name_depart}
                      type="text"
                      name="name_depart"
                    />
                    <Box height={20} />
                    <Button
                      text="Guardar"
                      color="blue"
                      onClick={this._add_depart}
                    />
                    <Box height={100} />
                  </Section>
                ) : (
                  ""
                )}
                {this.state.action_department === "edit" ? (
                  <Section title="Editar">
                    <div className="close_btn flex">
                      <IconButton
                        accessibilityLabel="close"
                        bgColor="white"
                        icon="clear"
                        iconColor="red"
                        onClick={() => {
                          this.closeActionDepart();
                        }}
                      />
                    </div>
                    <input
                      id="edit_depart"
                      onChange={this.handleChange}
                      placeholder={this.state.depart}
                      value={this.state.edit_field_depart}
                      type="text"
                      name="edit_field_depart"
                    />
                    <Box height={20} />
                    <Button
                      text="Guardar"
                      color="blue"
                      onClick={this._edit_depart}
                    />
                  </Section>
                ) : (
                  ""
                )}
                {this.state.action_department === "delete" ? (
                  <Section title="Borrar">
                    <div className="close_btn flex">
                      <IconButton
                        accessibilityLabel="close"
                        bgColor="white"
                        icon="clear"
                        iconColor="red"
                        onClick={() => {
                          this.closeActionDepart();
                        }}
                      />
                    </div>
                    <Box height={20} />
                    <Button
                      text="Eliminar"
                      color="red"
                      onClick={this._delete_depart}
                    />
                  </Section>
                ) : (
                  ""
                )}
                {this.state.action_department ? "" : <Box height={120} />}
                {/*
                 */}
                <ActionDepartemnt
                  handleClick={this.handleClickActionDepartemnt}
                />
                {/*
                 */}
              </Box>
            </Box>
          </Column>
          <Column span={6}>
            <Box color="lightGray" padding={1}>
              <Box color="white" paddingY={2}>
                <Text align="center" bold>
                  Proyectos
                </Text>
                <Box height={200} />
              </Box>
            </Box>
          </Column>
        </Box>
      </div>
    );
  }
}

export default App;
