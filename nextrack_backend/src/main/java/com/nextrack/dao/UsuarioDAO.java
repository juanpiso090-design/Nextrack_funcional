package com.nextrack.dao;

import com.nextrack.model.Usuario;
import com.nextrack.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

public class UsuarioDAO {

    /**
     * Busca un usuario en la base de datos según su nombre de usuario (username).
     * @param username El nombre de usuario ingresado en el formulario.
     * @return El objeto Usuario completo si existe, o null si no se encuentra.
     */
    public Usuario validarUsuario(String username) {
        Transaction transaction = null;
        Usuario usuario = null;
        
        // Abrimos una sesión limpia con Hibernate desde nuestra clase Util
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            // Iniciamos la transacción de lectura
            transaction = session.beginTransaction();
            
            // Creamos la consulta HQL (se consulta la clase 'Usuario' y su atributo 'username')
            String hql = "FROM Usuario WHERE username = :userParam";
            Query<Usuario> query = session.createQuery(hql, Usuario.class);
            query.setParameter("userParam", username);
            
            // Intentamos obtener el resultado único de la base de datos
            usuario = query.uniqueResult();
            
            // Confirmamos la transacción
            transaction.commit();
            
        } catch (Exception e) {
            // Si algo falla (error de conexión, nombres mal mapeados, etc.), cancelamos la transacción
            if (transaction != null) {
                transaction.rollback();
            }
            System.err.println("🚨 Error en UsuarioDAO al validar usuario: " + e.getMessage());
            e.printStackTrace();
        }
        
        return usuario;
    }
}