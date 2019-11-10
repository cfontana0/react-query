import React from "react";
import "./App.css";
import { useInfiniteQuery } from "react-query";
import { fetchTodos } from "./api";
import { AddTodo } from "./components/AddTodo";
import { TodoItem } from "./components/TodoItem";
import { makeStyles } from '@material-ui/core/styles';
import { Button, List } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  button: {
    width: '100%'
  },
}));

function App() {
  const {
    data,
    error,
    isLoading,
    isError,
    canFetchMore,
    fetchMore,
    isFetchingMore,
  } = useInfiniteQuery("todos", fetchTodos, {
    getFetchMore: (lastGroup) => lastGroup.offset,
  });
  const classes = useStyles();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>{JSON.stringify(error)}</p>;
  }

  return (
    <>
      <AddTodo/>
        <List dense>
          {data.map((group, i) => (
            <React.Fragment key={i}>
              {group.records.map(({id, fields}) => {
                return <TodoItem key={id} id={id} {...fields}/>
              })}
            </React.Fragment>
          ))}
        </List>
      <div>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={() => fetchMore()} 
          disabled={!canFetchMore || isFetchingMore}
          className={classes.button}
        >
          {isFetchingMore
            ? "Loading more..."
            : canFetchMore
            ? "Load more"
            : "Nothing to load"}
        </Button>
      </div>
    </>
  );
}

export default App;
