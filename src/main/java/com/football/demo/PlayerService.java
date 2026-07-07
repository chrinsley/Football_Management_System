package com.football.demo;

import com.football.demo.dto.PlayerRequest;
import com.football.demo.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PlayerService {

    private final PlayerRepository repository;
    private final TeamRepository teamRepository;

    public PlayerService(PlayerRepository repository, TeamRepository teamRepository) {
        this.repository = repository;
        this.teamRepository = teamRepository;
    }

    @Transactional(readOnly = true)
    public List<Player> getAllPlayers() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Player> searchPlayers(String name, Long teamId, String position) {
        if (name != null && !name.isBlank()) {
            return repository.findByNameContainingIgnoreCase(name.trim());
        }
        if (teamId != null) {
            return repository.findByTeamId(teamId);
        }
        if (position != null && !position.isBlank()) {
            return repository.findByPositionIgnoreCase(position.trim());
        }
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Player getPlayerById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + id));
    }

    public Player createPlayer(PlayerRequest request) {
        validateTeamExists(request.getTeamId());
        Player player = new Player();
        applyRequest(player, request);
        return repository.save(player);
    }

    public Player updatePlayer(Long id, PlayerRequest request) {
        Player player = getPlayerById(id);
        validateTeamExists(request.getTeamId());
        applyRequest(player, request);
        return repository.save(player);
    }

    public void deletePlayer(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Player not found with id: " + id);
        }
        repository.deleteById(id);
    }

    private void validateTeamExists(Long teamId) {
        if (!teamRepository.existsById(teamId)) {
            throw new ResourceNotFoundException("Team not found with id: " + teamId);
        }
    }

    private void applyRequest(Player player, PlayerRequest request) {
        player.setName(request.getName());
        player.setAge(request.getAge());
        player.setPosition(request.getPosition());
        player.setTeamId(request.getTeamId());
        player.setJerseyNumber(request.getJerseyNumber());
    }
}
