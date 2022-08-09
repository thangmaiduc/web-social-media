import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import Layout from '../../components/Layout';

export default function Dashboard() {
  return (
    <Layout>
      <Stack
        direction='row'
        justifyContent='center'
        alignItems='center'
        spacing={2}
      >
        <Card sx={{ maxWidth: 345 }}>
          <CardActionArea sx={{ backgroundColor: '#ccff99' }}>
            <CardContent>
              <Typography gutterBottom variant='h5' component='div'>
                Số người dùng mới trong tháng
              </Typography>
              <Typography variant='h5' color='text.secondary'>
                6000
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size='small' color='primary'>
              Share
            </Button>
          </CardActions>
        </Card>
        <Card sx={{ maxWidth: 345 }}>
          <CardActionArea sx={{ backgroundColor: '#ffffcc' }}>
            <CardContent>
              <Typography gutterBottom variant='h5' component='div'>
                Số người dùng mới trong tháng
              </Typography>
              <Typography variant='h5' color='text.primary'>
                6000
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size='small' color='primary'>
              Share
            </Button>
          </CardActions>
        </Card>
        <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <CardContent sx={{ backgroundColor: '#66ff33'}}>
              <Typography gutterBottom variant='h5' component='div'>
                Số người dùng mới trong tháng
              </Typography>
              <Typography variant='h5' color='text.primary'>
                6000
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size='small' color='primary'>
              Share
            </Button>
          </CardActions>
        </Card>
      </Stack>
    </Layout>
  );
}
