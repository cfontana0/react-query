import React, { useRef } from 'react'
import { useMutation, useQueryCache } from 'react-query'
import { createTodo } from '../api'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Divider, TextField} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  margin: {
    marginLeft: theme.spacing(1),
  },
  marginDivider: {
    marginTop: theme.spacing(1),
  }
}));

export const AddTodo = () => {
  const classes = useStyles();
  const inputRef = useRef();
  const queryCache = useQueryCache();

  const [mutateAdd] = useMutation(createTodo, {
    onSuccess: () => queryCache.invalidateQueries("todos")
  })

  const onAdd = () => {
    mutateAdd({text: inputRef.current.value})
    inputRef.current.value = ""
  }

  return <>
    <TextField 
      id="outlined-basic" 
      label="ToDo Title" 
      variant="outlined" 
      size="small" 
      inputRef={inputRef} 
    />
    <Button 
      variant="contained" 
      color="primary" 
      className={classes.margin} 
      onClick={onAdd}
      disableElevation
    >
      Add ToDo
    </Button>
    <Divider className={classes.marginDivider}  />
  </>
}