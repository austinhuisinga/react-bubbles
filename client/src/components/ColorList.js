import React, { useState } from "react";
import { axiosWithAuth } from '../utils/axiosWithAuth';
import { useForm } from 'react-hook-form';

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [colorToAdd, setColorToAdd] = useState({
    color: '',
    code: { hex: '' },
    id: Date.now(),
  });

  const { handleSubmit, register, errors } = useForm({});

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = e => {
    e.preventDefault();
    // Make a put request to save your updated color
    // think about where will you get the id from...
    // where is is saved right now?
    axiosWithAuth()
      .put(`/api/colors/${colorToEdit.id}`, colorToEdit)
      .then(res => {
        console.log(res);
        updateColors(
          colors.map(color => {
            return color.id === colorToEdit.id ? colorToEdit : color;
          })
        )
      })
      .catch(err => console.log('SAVEEDIT ERRORR', err))
  };

  const deleteColor = color => {
    // make a delete request to delete this color
    axiosWithAuth()
      .delete(`/api/colors/${color.id}`)
      .then(() => {
        axiosWithAuth()
        .get('/api/colors')
        .then(res => updateColors(res.data))
        .catch(err => console.log('Delete-Get-Error', err));
        setEditing(false);
      })
  };

  const addColor = e => {
    // e.preventDefault();
    axiosWithAuth()
      .post(`/api/colors`, colorToAdd)
      .then(() => {
        updateColors([...colors, colorToAdd]);
        setColorToAdd(initialColor);
      })
      .catch(err => console.log('Add Color Errorr', err))
  }

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span 
                className="delete" 
                onClick={e => {
                  e.stopPropagation();
                  deleteColor(color)
                }}
              >
                  x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <div className="spacer" />
      {/* stretch - build another form here to add a color */}

      <form onSubmit={handleSubmit(addColor)}>
        <h3>Add a New Color</h3>
        <label htmlFor=''>color name:</label>
        <input
          onChange={e => setColorToAdd({ ...colorToAdd, color: e.target.value })}
        />

        <label htmlFor='hex'>hex code: </label>
        <input
          onChange={e => setColorToAdd({ ...colorToAdd, code: { hex: e.target.value }})}
          />
        <button type='submit'>Add Color!</button>
      </form>
    </div>
  );
};

export default ColorList;
