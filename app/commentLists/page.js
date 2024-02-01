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

    const commentData = {
      commentId,
      comment,
      now,
    };

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set Content-Type header
        },
        body: JSON.stringify({ commentData }), // Serialize data as JSON string
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
      const response = await fetch(`/api/comments`, {
        method: "GET",
      });

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
      body: JSON.stringify({ commentId, updateText }),
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
