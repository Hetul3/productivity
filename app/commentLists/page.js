"use client";

import { useEffect, useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { AiOutlineCheck } from "react-icons/ai";
import { BiSolidPencil } from "react-icons/bi";
import { useSession, getSession } from "next-auth/react";

export default function CommentsPage() {
  const { data: session, status } = useSession();

  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([
    { Id: 0, date: "", text: "" }, // You can set default values or use actual values here
  ]);

  const [updateText, setUpdateText] = useState("");
  const [commentToEdit, setCommentToEdit] = useState(null);

  const addComment = async () => {
    const commentId = new Date().getTime();
    const current = new Date();
    const temp_month = current.getMonth();
    const temp_day = current.getDate();
    const temp_hour = current.getHours();
    const temp_minute = current.getMinutes();

    const now = {
      temp_month,
      temp_day,
      temp_hour,
      temp_minute,
    };

    try {
      const commentData = {
        commentId,
        comment,
        now,
      };

      const response = await fetch("/api/comments", {
        method: "POST",
        body: JSON.stringify({ commentData }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        fetchComments();
      } else {
        console.error("Failed to create comment.");
      }
    } catch (error) {
      console.error("Error fetching session: ", error);
    }
  };
  const fetchComments = async () => {
    try {
      const userSession = await getSession();
      const userID = userSession?.user?.name;
      const response = await fetch(
        `/api/comments`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        const commentsArray = Array.isArray(data) ? data : [];
        setCommentList(commentsArray);
        console.log(data);
      } else {
        console.error("Failed to fetch comments");
      }
    } catch (error) {
      console.error("Error fetching comments: ", error);
    }
  };

  const handleDelete = async (commentId) => {

    const sendData = {
      commentId,
    };

    const response = await fetch("/api/comments", {
      method: "DELETE",
      body: JSON.stringify({ sendData }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      fetchComments();
    } else {
      console.error("Failed to delete comment");
    }
  };

  const handleUpdate = async (commentId) => {

    const sendData = {
      commentId,
      updateText,
    };

    const response = await fetch("/api/comments", {
      method: "PUT",
      body: JSON.stringify({ sendData }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      fetchComments();
    } else {
      console.error("Failed to update comment");
    }
  };

  const handleEdit = (commentId) => {
    // Set the comment ID to be edited
    setCommentToEdit(commentId);

    // Find the comment in the list and set its text for editing
    const commentToEdit = commentList.find(
      (comment) => comment.Id === commentId
    );
  setUpdateText(commentToEdit.text);

  };

  const handleCancelEdit = () => {
    // Clear the comment ID being edited and reset the text
    setCommentToEdit(null);
    setUpdateText("");
  };

  const handleSubmitEdit = (commentId) => {
    // Perform update operation
    handleUpdate(commentId);

    // Reset the comment ID being edited and clear the text
    setCommentToEdit(null);
    setUpdateText("");
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <>
      <div>
        {/* Add Comment Form */}
        <form>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment..."
          />
          <button type="button" onClick={addComment}>
            Add Comment
          </button>
        </form>
      </div>

      <div>
        {/* Display Comments */}
        <ul>
          {commentList.map((commentItem) => (
            <li key={commentItem.Id}>
              <div>
                <span>{commentItem.Comment_text}</span>
                <span>{commentItem.Date_created}</span>
              </div>
              <div>
                {/* Edit Button */}
                {commentToEdit !== commentItem.Id ? (
                  <button onClick={() => handleEdit(commentItem.Id)}>
                    <BiSolidPencil />
                  </button>
                ) : (
                  <>
                    {/* Save Button */}
                    <button onClick={() => handleSubmitEdit(commentItem.Id)}>
                      <AiOutlineCheck />
                    </button>
                    {/* Cancel Button */}
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </>
                )}
                {/* Delete Button */}
                <button onClick={() => handleDelete(commentItem.Id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

// export default function CommentsPage() {
//   const { data: session, status } = useSession();

//   const [comments, setComments] = useState([]);
//   const [comment, setComment] = useState("");
//   const [updateCommentId, setUpdateCommentId] = useState(null);
//   const [updatedText, setUpdatedText] = useState("");
//   const [isClient, setIsClient] = useState(false);
//   const scrollContainerRef = useRef(null);

//   const numberToMonth = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   const fetchComments = async () => {
//     try {
//       const response = await fetch("/api/comments", {
//         method: "GET",
//       });

//       if (!response.ok) {
//         throw new Error(`Error fetching comments: ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log(data);
//       setComments(data.comments);
//       console.log("API Response:", data);
//     } catch (error) {
//       console.error("Error fetching comments:", error);
//     }
//   };

//   const handleComment = async () => {
//     const current = new Date();
//     const commentId = current.getTime(); // Using current timestamp as commentId

//     try {
//       const commentData = {
//         comment,
//         now: {
//           temp_month: current.getMonth(),
//           temp_day: current.getDate(),
//           temp_hour: current.getHours(),
//           temp_minute: current.getMinutes(),
//           temp_seconds: current.getSeconds(),
//         },
//         commentId,
//       };

//       const response = await fetch("/api/comments", {
//         method: "POST",
//         body: JSON.stringify({ commentData }),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         fetchComments();
//         setComment(""); // Clear the input field after submitting the comment
//       } else {
//         console.log("Failed to create comment");
//       }
//     } catch (error) {
//       console.error("Error creating comment:", error);
//     }
//   };

//   const handleUpdate = async (commentId) => {
//     const commentToUpdate = comments.find((c) => c.id === commentId);
//     const current = new Date();
//     const now = {
//       temp_month: current.getMonth(),
//       temp_day: current.getDate(),
//       temp_hour: current.getHours(),
//       temp_minute: current.getMinutes(),
//       temp_seconds: current.getSeconds(),
//     };
//     setUpdatedText(commentToUpdate.text);

//     if (updateCommentId === commentId) {
//       const response = await fetch(`/api/comments`, {
//         method: "PUT",
//         body: JSON.stringify({
//           text: updatedText,
//           date: now,
//         }),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.ok) {
//         setComments((prevComments) =>
//           prevComments.map((comment) =>
//             comment.id === commentId
//               ? {
//                   ...comment,
//                   text: updatedText,
//                   date: now,
//                 }
//               : comment
//           )
//         );

//         setUpdateCommentId(null);
//         setUpdatedText("");
//       } else {
//         console.error("Failed to update comment.");
//       }
//     } else {
//       setUpdateCommentId(commentId);
//     }
//   };

//   const deleteComment = async (commentId) => {
//     try {
//       const response = await fetch(`/api/comments`, {
//         method: "DELETE",
//       });

//       if (response.ok) {
//         setComments((prevComments) =>
//           prevComments.filter((comment) => comment.id !== commentId)
//         );
//       } else {
//         console.error("Failed to delete comment");
//       }
//     } catch (error) {
//       console.error("Error deleting comment:", error);
//     }
//   };

//   const handleKeyPress = (event, commentId) => {
//     if (event.key === "Enter") {
//       if (event.target.id === "main-input") {
//         handleComment(commentId);
//       } else if (event.target.id === "update-input") {
//         handleUpdate(commentId);
//       }
//     }
//   };

//   useEffect(() => {
//     setIsClient(true);
//     fetchComments();
//   }, []);

//   useEffect(() => {
//     if (isClient && scrollContainerRef.current) {
//       window.customScrollContainer = scrollContainerRef.current;
//     }
//   }, [isClient]);

//   const handleDragEnd = (result) => {
//     if (!result.destination) {
//       return;
//     }

//     if (result.source.index === result.destination.index) {
//       return;
//     }

//     const updatedComments = Array.from(comments);
//     const [reorderedItem] = updatedComments.splice(result.source.index, 1);
//     updatedComments.splice(result.destination.index, 0, reorderedItem);

//     setComments(updatedComments);
//   };

//   return (
//     <>
//       <button className="todo-list-submit-button" onClick={handleComment(new Date().getTime())}>
//         Submit Comment
//       </button>
//       <hr />
//       <div className="todo-list-parent-container">
//         <div className="todo-list-input-container">
//           <input
//             id="main-input"
//             className="todo-list-text-input"
//             type="text"
//             placeholder="Add Something"
//             value={comment}
//             onKeyPress={(event) => handleKeyPress(event, null)}
//             onChange={(e) => setComment(e.target.value)}
//           />
//           <div className="line"></div>
//         </div>
//         {isClient && (
//           <DragDropContext onDragEnd={handleDragEnd}>
//             {comments.length > 0 ? (
//               <Droppable droppableId="droppable-comments">
//                 {(provided, snapshot) => (
//                   <div
//                     className="todo-list-items-container"
//                     ref={(ref) => {
//                       provided.innerRef(ref);
//                       scrollContainerRef.current = ref;
//                     }}
//                     {...provided.droppableProps}
//                     data-rbd-droppable-context-id={
//                       snapshot.isUsingPlaceholder ? "droppable-context" : "1"
//                     }
//                   >
//                     {comments.map((comment, index) => (
//                       <Draggable
//                         key={comment.id}
//                         draggableId={comment.id.toString()}
//                         index={index}
//                       >
//                         {(provided) => (
//                           <div
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}
//                           >
//                             {updateCommentId === comment.id ? (
//                               <div className="todo-list-item-container">
//                                 <input
//                                   key={comment.id}
//                                   id="update-input"
//                                   className="todo-list-update-input"
//                                   type="text"
//                                   value={updatedText}
//                                   onKeyPress={(event) =>
//                                     handleKeyPress(event, comment.id)
//                                   }
//                                   onChange={(e) =>
//                                     setUpdatedText(e.target.value)
//                                   }
//                                 />
//                                 <button
//                                   className="todo-list-update-button"
//                                   onClick={() => handleUpdate(comment.id)}
//                                 >
//                                   <BiSolidPencil />
//                                 </button>
//                               </div>
//                             ) : (
//                               <>
//                                 <div className="todo-list-item-mega-parent-container">
//                                   <div className="todo-list-item-parent-container">
//                                     <div className="todo-list-item-text-container">
//                                       <h2 className="todo-list-item-text">
//                                         {comment.text}
//                                       </h2>
//                                     </div>
//                                     <div className="todo-list-item-button-container">
//                                       <button
//                                         className="todo-list-update-button"
//                                         onClick={() => handleUpdate(comment.id)}
//                                       >
//                                         <BiSolidPencil />
//                                       </button>
//                                       <button
//                                         className="todo-list-delete-button"
//                                         onClick={() =>
//                                           deleteComment(comment.id)
//                                         }
//                                       >
//                                         <AiOutlineCheck />
//                                       </button>
//                                     </div>
//                                   </div>
//                                   <p className="date-text">
//                                     {numberToMonth[comment.date.temp_month]} /{" "}
//                                     {comment.date.temp_day} /{" "}
//                                     {comment.date.temp_hour}:
//                                     {comment.date.temp_minute
//                                       .toString()
//                                       .padStart(2, "0")}
//                                     :
//                                     {comment.date.temp_seconds
//                                       .toString()
//                                       .padStart(2, "0")}
//                                   </p>
//                                 </div>
//                                 <hr className="list-line" />
//                               </>
//                             )}
//                           </div>
//                         )}
//                       </Draggable>
//                     ))}
//                     {/* Add the input element for the last comment here */}
//                     <div className="todo-list-item-mega-parent-container">
//                       <input
//                         id="main-input"
//                         className="todo-list-text-input"
//                         type="text"
//                         placeholder="Add Something"
//                         value={comment}
//                         onKeyPress={(event) => handleKeyPress(event, null)}
//                         onChange={(e) => setComment(e.target.value)}
//                       />
//                       <div className="line"></div>
//                     </div>
//                     {provided.placeholder}
//                   </div>
//                 )}
//               </Droppable>
//             ) : (
//               <></>
//             )}
//           </DragDropContext>
//         )}
//       </div>
//     </>
//   );
// }
