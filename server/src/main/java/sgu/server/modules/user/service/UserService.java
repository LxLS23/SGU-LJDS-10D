package sgu.server.modules.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sgu.server.modules.user.model.User;
import sgu.server.modules.user.model.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        if (userRepository.existsByCorreoElectronico(user.getCorreoElectronico())) {
            throw new RuntimeException("El correo electrónico ya está en uso");
        }
        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));

        if (userRepository.existsByCorreoElectronicoAndIdNot(userDetails.getCorreoElectronico(), id)) {
            throw new RuntimeException("El correo electrónico ya está en uso por otro usuario");
        }

        user.setNombreCompleto(userDetails.getNombreCompleto());
        user.setCorreoElectronico(userDetails.getCorreoElectronico());
        user.setNumeroTelefono(userDetails.getNumeroTelefono());

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
        userRepository.delete(user);
    }
}