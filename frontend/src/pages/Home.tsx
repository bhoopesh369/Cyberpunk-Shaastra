import { NavBar } from '../components';
import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const Home = () => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      style={{
        backgroundColor: 'black',
      }}
    >
      <AppShell.Header>
        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="sm"
          size="sm"
        />
        <div>LOGO</div>
      </AppShell.Header>

      <AppShell.Navbar p="md">

        

      </AppShell.Navbar>

      <AppShell.Main>Main</AppShell.Main>
    </AppShell>
  );
}

   
export default Home;
