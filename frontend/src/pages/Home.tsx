import { Card, CardContent, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import api from "../utils/axios";
interface Post {
  title: string;
}
export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<unknown>();
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await api.get("/protected");
        setPosts(response.data);
      } catch (error) {
        setError(error);
      }
    }
    fetchPosts();
  }, []);
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {error ? (
        <Typography textAlign="center" variant="h3">
          An Error Occurred
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {posts.map((post) => (
            <Grid container key={post.title}>
              <Card sx={{ minHeight: 75,display:'flex',alignItems:'center' }}>
                <CardContent >
                  <Typography variant="h5" component="div">
                    {post.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
