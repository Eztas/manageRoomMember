"use client";

import { useEffect, useState } from 'react';
import { Container, CircularProgress, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

const Home = () => {
  const [members, setMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembersData = async () => {
    setLoading(true);
    try {
      const response_members = await fetch('api/getMembers');
      const members_data = await response_members.json();
      setMembers(members_data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembersData();
  }, []);

  useEffect(() => {
    const runPing = async () => {
      await fetch('/api/runPing');
    };
    runPing();
    const pingInterval = setInterval(runPing, 120000); // 2分ごとに実行, 定期的に同じLAN内の端末と通信
    return () => clearInterval(pingInterval);
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>在室メンバー(再読み込みで更新)</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper>
          <List>
            {members.map((name, index) => (
              <ListItem key={index}>
                <ListItemText primary={name} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default Home;
