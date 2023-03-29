export function Post() {
	return (
		<div className="post">
			<h1>Write a new post</h1>
			<div className="postContainer">
				<div className="titleContainer">
					<label htmlFor="title">Title</label>
					<input type="text" name="title" id="title"></input>
				</div>
				<div className= "bodyContainer">
					<label htmlFor="body">Body</label>
					<textarea name="body" id="body"></textarea>
				</div>
				<div className="imageContainer">
					<label htmlFor="image">Image</label>
					<input type="text" name="image" id="image"></input>
				</div>
				<div className="btnContainer">
					<button type="submit" className="submitBtn">Submit</button>
				</div>
			</div>
		</div>
	)
}
