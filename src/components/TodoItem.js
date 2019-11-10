import React from "react";
import { useMutation, useQueryCache } from "react-query";
import { deleteTodo, updateTodo } from "../api";
import { makeStyles } from '@material-ui/core/styles';
import  {  
          Checkbox, 
          Divider, 
          IconButton, 
          ListItem, 
          ListItemSecondaryAction,
          ListItemText 
        } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import grey from '@material-ui/core/colors/grey';

const useStyles = makeStyles((theme) => ({
  listItemBackground: {
    backgroundColor: grey[200],
  },
}));


export const TodoItem = ({ id, text, completed }) => {
  const queryCache = useQueryCache();
  const classes = useStyles();

  const [mutateDelete] = useMutation(deleteTodo, {
    onSuccess: () => queryCache.invalidateQueries("todos"),
  });

  const [mutateCheck] = useMutation(updateTodo, {
    onMutate: (newTodo) => {
      queryCache.cancelQueries("todos");
      const previousQuery = queryCache.getQueryData("todos");
      queryCache.setQueryData("todos", (oldQuery) => {
        return oldQuery.map((group) => {
          return {
            ...group,
            records: group.records.map((record) => {
              if (record.id === newTodo.id) {
                return {
                  ...record,
                  fields: { ...record.fields, ...newTodo.fields },
                };
              } else {
                return record;
              }
            }),
          };
        });
      });
      return () => queryCache.setQueryData("todos", previousQuery);
    },
    onError: (err, newTodo, rollback) => rollback(),
    onSettled: (newTodo) => {
      queryCache.invalidateQueries("todos");
    },
  });

  const remove = () => {
    mutateDelete(id);
  };

  const onCheck = (event) => {
    mutateCheck({ id, fields: { completed: event.target.checked } });
  };

  return (
    <>
      <ListItem className={classes.listItemBackground} >
        <ListItemText primary={text} />
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="delete" onClick={remove}>
            <DeleteIcon />
          </IconButton>
          <Checkbox
            checked={!!completed}
            onChange={onCheck}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </>
  );
};
